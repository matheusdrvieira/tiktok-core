import { env } from '../../../../shared/config/env';
import { mcpApi } from '../../../../shared/lib/http-client';
import { CreateQuizUseCase } from '../../../quizzes/application/use-cases/create-quiz.use-case';
import { QuizOption } from '../../../quizzes/domain/entities/quiz-option.entity';
import { QuizQuestion } from '../../../quizzes/domain/entities/quiz-question.entity';
import { Quiz } from '../../../quizzes/domain/entities/quizzes.entity';
import { RenderVideoUseCase } from '../../../remotion/application/use-cases/render-video.use-case';
import { RenderQuizQuestion } from '../../../remotion/domain/types/types';
import { DirectPostUseCase } from '../../../tiktok/application/use-cases/direct-post.use-case';
import { CreateVideoUseCase } from '../../../videos/application/use-cases/create-video.use-case';
import { Video, VideoStatus } from '../../../videos/domain/entities/videos.entity';
import { UploadVideoUseCase } from '../../../youtube/application/use-cases/upload-video.use-case';
import { getRandomQuizReference } from '../../utils/randon-niches';

type McpQuizVideoQuestion = {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  answer: {
    correctAnswerIndex: number;
  };
  questionPath: string;
  answerCorrectPath: string;
};

type McpQuizVideoResponse = {
  title: string;
  hashtags: string;
  category: number;
  description: string;
  questions: McpQuizVideoQuestion[];
};

type GeneratedQuizDraft = {
  quizId: string;
  video: Video;
  questions: RenderQuizQuestion[];
};

const toHashtagsArray = (hashtags: string): string[] =>
  hashtags
    .split(/\s+/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag.replace(/^#+/, '')}`));

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown automation error.';
};

const buildPublishTitle = (title: string, hashtags: string[]): string => {
  const hashtagsText = hashtags.join(' ').trim();
  return hashtagsText ? `${title}\n${hashtagsText}` : title;
};

export class RunAutomationJobUseCase {
  constructor(
    private readonly createQuizUseCase: CreateQuizUseCase,
    private readonly createVideoUseCase: CreateVideoUseCase,
    private readonly renderVideoUseCase: RenderVideoUseCase,
    private readonly directPostUseCase: DirectPostUseCase,
    private readonly uploadVideoUseCase: UploadVideoUseCase,
  ) { }

  async execute(): Promise<void> {
    const { video, questions } = await this.generateQuizDraft(env.AUTOMATION_USER_ID);

    if (!video.id) {
      throw new Error('Video created without id.');
    }

    const rendered = await this.renderVideoUseCase.execute({
      userId: env.AUTOMATION_USER_ID,
      videoId: video.id,
      questions,
    });

    const publishTitle = buildPublishTitle(
      video.title,
      video.hashtags,
    );

    await Promise.allSettled([
      this.directPostUseCase.execute({
        userId: env.AUTOMATION_USER_ID,
        videoId: video.id,
        videoPath: rendered.url,
        title: publishTitle,
        privacyLevel: 'SELF_ONLY',
        disableComment: false,
        disableDuet: true,
        disableStitch: true,
        brandContentToggle: false,
        brandOrganicToggle: false,
      }),
      this.uploadVideoUseCase.execute({
        userId: env.AUTOMATION_USER_ID,
        videoId: video.id,
        videoPath: rendered.url,
        title: publishTitle,
      }),
    ]);
  }

  private async generateQuizDraft(userId: string): Promise<GeneratedQuizDraft> {
    const { niche, reference } = getRandomQuizReference();

    const { data } = await mcpApi.post<McpQuizVideoResponse>(
      '/quiz/video',
      {
        niche,
        reference,
        questionsCount: 5,
      },
    );

    const questionsWithPublicPaths = data.questions.map((question) => ({
      ...question,
      questionPath: `${env.BACKEND_URL}/bucket/audio?key=${encodeURIComponent(question.questionPath)}`,
      answerCorrectPath: `${env.BACKEND_URL}/bucket/audio?key=${encodeURIComponent(question.answerCorrectPath)}`,
    }));

    const createdQuiz = await this.createQuizUseCase.execute(
      Quiz.create({
        userId,
        questions: questionsWithPublicPaths.map((question) =>
          QuizQuestion.create({
            id: question.id,
            question: question.question,
            correctAnswerIndex: question.answer.correctAnswerIndex,
            questionPath: question.questionPath,
            answerCorrectPath: question.answerCorrectPath,
            options: question.options.map((option) =>
              QuizOption.create({
                id: option.id,
                text: option.text,
              }),
            ),
          }),
        ),
      }),
    );

    if (!createdQuiz.id) {
      throw new Error('Failed to persist quiz: missing quiz id.');
    }

    const createdVideo = await this.createVideoUseCase.execute(
      Video.create({
        userId,
        title: data.title,
        hashtags: toHashtagsArray(data.hashtags),
        description: data.description,
        category: String(data.category),
        status: VideoStatus.DRAFT,
        quizId: createdQuiz.id,
      }),
    );

    return {
      quizId: createdQuiz.id,
      video: createdVideo,
      questions: questionsWithPublicPaths,
    };
  }
}
