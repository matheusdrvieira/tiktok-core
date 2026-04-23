import { Elysia, t } from 'elysia';
import { env } from '../../../../../shared/config/env';
import { logAndReportError } from '../../../../../shared/lib/discord-error';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { getAxiosErrorMessage, mcpApi } from '../../../../../shared/lib/http-client';
import { makeCreateQuizUseCase } from '../../../../quizzes/application/factory/make-create-quiz-use-case.factory';
import { QuizOption } from '../../../../quizzes/domain/entities/quiz-option.entity';
import { QuizQuestion } from '../../../../quizzes/domain/entities/quiz-question.entity';
import { Quiz } from '../../../../quizzes/domain/entities/quizzes.entity';
import { makeCreateVideoUseCase } from '../../../../videos/application/factory/make-create-video-use-case.factory';
import { Video, VideoStatus } from '../../../../videos/domain/entities/videos.entity';

const createQuizUseCase = makeCreateQuizUseCase();
const createVideoUseCase = makeCreateVideoUseCase();

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

const toHashtagsArray = (hashtags: string): string[] =>
  hashtags
    .split(/\s+/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag.replace(/^#+/, '')}`));

export const generateQuizVideoController = new Elysia()
  .use(authGuard)
  .post(
    '/ai/quiz/video',
    async ({ set, body, user }) => {
      try {
        const { data } = await mcpApi.post<McpQuizVideoResponse>('/quiz/video', body);
        const questionsWithPublicPaths = data.questions.map((question) => ({
          ...question,
          questionPath: `${env.BACKEND_URL}/bucket/audio?key=${encodeURIComponent(question.questionPath)}`,
          answerCorrectPath: `${env.BACKEND_URL}/bucket/audio?key=${encodeURIComponent(question.answerCorrectPath)}`,
        }));

        const createdQuiz = await createQuizUseCase.execute(
          Quiz.create({
            userId: user.id,
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

        const createdVideo = await createVideoUseCase.execute(
          Video.create({
            userId: user.id,
            title: data.title,
            hashtags: toHashtagsArray(data.hashtags),
            description: data.description,
            category: String(data.category),
            status: VideoStatus.DRAFT,
            quizId: createdQuiz.id,
          }),
        );

        return {
          ...data,
          quizId: createdQuiz.id,
          videoId: createdVideo.id,
          questions: questionsWithPublicPaths,
        };
      } catch (err) {
        logAndReportError('[ai][generateQuizVideo] error:', err);
        set.status = 502;
        return {
          message: `Failed to generate quiz video via MCP: ${getAxiosErrorMessage(err)}`,
        };
      }
    },
    {
      auth: true,
      body: t.Object({
        niche: t.String({ minLength: 1 }),
        reference: t.String({ minLength: 1 }),
        questionsCount: t.Number({ minimum: 4, maximum: 10 }),
      }),
    },
  );
