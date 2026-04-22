import { env } from '../../../../shared/config/env';
import { GenerateNarrationUseCase } from '../../../ai/application/use-cases/generate-narration.use-case';
import { GenerateQuizUseCase } from '../../../ai/application/use-cases/generate-quiz.use-case';
import {
  GenerateQuizOutput,
  GenerateQuizNarrationOutput,
} from '../../../ai/domain/types/types';
import { QuizOption } from '../../../quizzes/domain/entities/quiz-option.entity';
import { QuizQuestion } from '../../../quizzes/domain/entities/quiz-question.entity';
import { Quiz } from '../../../quizzes/domain/entities/quizzes.entity';
import { CreateQuizUseCase } from '../../../quizzes/application/use-cases/create-quiz.use-case';
import { RenderVideoUseCase } from '../../../remotion/application/use-cases/render-video.use-case';
import { DirectPostUseCase } from '../../../tiktok/application/use-cases/direct-post.use-case';
import { CreateVideoUseCase } from '../../../videos/application/use-cases/create-video.use-case';
import { Video, VideoStatus } from '../../../videos/domain/entities/videos.entity';
import { UploadVideoUseCase } from '../../../youtube/application/use-cases/upload-video.use-case';
import {
  AutomationRunStage,
  AutomationService,
} from '../../infra/http/services/automation.service';
import { buildQuestionHash } from '../../utils/question-signature';
import { getRandomQuizReference } from '../../utils/randon-niches';

type PersistedQuizDraft = {
  quizId: string;
  video: Video;
};

const QUIZ_QUESTIONS_COUNT = 5;
const UNIQUE_GENERATION_ATTEMPTS = 5;
const DEFAULT_STEP_ATTEMPTS = 3;

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

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const toPublicAudioUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${env.BACKEND_URL}/bucket/audio?key=${encodeURIComponent(path)}`;
};

const withPublicAudioUrls = (
  data: GenerateQuizNarrationOutput,
): GenerateQuizNarrationOutput => ({
  ...data,
  questions: data.questions.map((question) => ({
    ...question,
    questionPath: toPublicAudioUrl(question.questionPath),
    answerCorrectPath: toPublicAudioUrl(question.answerCorrectPath),
  })),
});

export class RunAutomationJobUseCase {
  constructor(
    private readonly createQuizUseCase: CreateQuizUseCase,
    private readonly createVideoUseCase: CreateVideoUseCase,
    private readonly generateQuizUseCase: GenerateQuizUseCase,
    private readonly generateNarrationUseCase: GenerateNarrationUseCase,
    private readonly renderVideoUseCase: RenderVideoUseCase,
    private readonly directPostUseCase: DirectPostUseCase,
    private readonly uploadVideoUseCase: UploadVideoUseCase,
    private readonly automationService: AutomationService,
  ) { }

  async execute(): Promise<void> {
    const userId = env.AUTOMATION_USER_ID;

    if (await this.automationService.hasRunningRun(userId)) {
      console.warn('[automation] skipping run because another automation run is active.');
      return;
    }

    const { niche, reference } = getRandomQuizReference();
    const run = await this.automationService.createRun({
      userId,
      niche,
      reference,
    });

    try {
      const generatedQuiz = await this.generateUniqueQuiz({
        runId: run.id,
        userId,
        niche,
        reference,
      });

      await this.automationService.markStage(
        run.id,
        AutomationRunStage.GENERATING_NARRATION,
      );

      const narratedQuiz = await this.withRetry(
        'generate narration',
        () => this.generateNarrationUseCase.execute(generatedQuiz),
      );
      const narratedQuizWithPublicPaths = withPublicAudioUrls(narratedQuiz);

      await this.automationService.markStage(
        run.id,
        AutomationRunStage.PERSISTING_QUIZ,
      );

      const { quizId, video } = await this.persistQuizDraft(
        userId,
        narratedQuizWithPublicPaths,
      );

      if (!video.id) {
        throw new Error('Video created without id.');
      }

      await this.automationService.attachQuizAndVideo(run.id, {
        quizId,
        videoId: video.id,
      });

      await this.automationService.saveQuestionHistory({
        userId,
        niche,
        reference,
        questions: narratedQuizWithPublicPaths.questions,
      });

      await this.automationService.markStage(run.id, AutomationRunStage.RENDERING);

      const rendered = await this.withRetry(
        'render video',
        () => this.renderVideoUseCase.execute({
          userId,
          videoId: video.id!,
          questions: narratedQuizWithPublicPaths.questions,
        }),
        2,
      );

      await this.automationService.markStage(run.id, AutomationRunStage.PUBLISHING);

      await this.publishVideo({
        userId,
        video,
        videoPath: rendered.url,
      });

      await this.automationService.markSucceeded(run.id);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[automation][run] error:', error);
      await this.automationService.markFailed(run.id, message);
      throw error;
    }
  }

  private async generateUniqueQuiz(input: {
    runId: string;
    userId: string;
    niche: string;
    reference: string;
  }): Promise<GenerateQuizOutput> {
    const extraExcludedQuestions = new Set<string>();

    for (let attempt = 1; attempt <= UNIQUE_GENERATION_ATTEMPTS; attempt += 1) {
      await this.automationService.markStage(
        input.runId,
        AutomationRunStage.GENERATING_QUIZ,
        attempt,
      );

      const excludedQuestions = await this.automationService.getExcludedQuestions(
        input.userId,
        input.niche,
        input.reference,
      );

      const quiz = await this.withRetry(
        'generate quiz',
        () => this.generateQuizUseCase.execute({
          niche: input.niche,
          reference: input.reference,
          questionsCount: QUIZ_QUESTIONS_COUNT,
          excludedQuestions: [
            ...excludedQuestions,
            ...extraExcludedQuestions,
          ],
        }),
      );

      const duplicateQuestions = await this.findDuplicateQuestions(
        input.userId,
        quiz,
      );

      if (duplicateQuestions.length === 0) {
        return quiz;
      }

      for (const question of duplicateQuestions) {
        extraExcludedQuestions.add(question);
      }

      console.warn(
        `[automation] generated quiz repeated ${duplicateQuestions.length} question(s); retrying with more context.`,
      );
    }

    throw new Error(
      `Failed to generate unique quiz for "${input.reference}" after ${UNIQUE_GENERATION_ATTEMPTS} attempts.`,
    );
  }

  private async findDuplicateQuestions(
    userId: string,
    quiz: GenerateQuizOutput,
  ): Promise<string[]> {
    const generatedQuestionHashes = new Set<string>();
    const repeatedWithinQuiz = new Set<string>();

    for (const question of quiz.questions) {
      const hash = buildQuestionHash(question.question);

      if (generatedQuestionHashes.has(hash)) {
        repeatedWithinQuiz.add(question.question);
      }

      generatedQuestionHashes.add(hash);
    }

    const repeatedFromHistory = await this.automationService.findDuplicateQuestions(
      userId,
      quiz.questions.map((question) => question.question),
    );

    return Array.from(new Set([
      ...repeatedWithinQuiz,
      ...repeatedFromHistory,
    ]));
  }

  private async persistQuizDraft(
    userId: string,
    data: GenerateQuizNarrationOutput,
  ): Promise<PersistedQuizDraft> {
    const createdQuiz = await this.createQuizUseCase.execute(
      Quiz.create({
        userId,
        questions: data.questions.map((question) =>
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
    };
  }

  private async publishVideo(input: {
    userId: string;
    video: Video;
    videoPath: string;
  }): Promise<void> {
    if (!input.video.id) {
      throw new Error('Video created without id.');
    }

    const publishTitle = buildPublishTitle(
      input.video.title,
      input.video.hashtags,
    );

    const results = await Promise.allSettled([
      this.withRetry(
        'publish to TikTok',
        () => this.directPostUseCase.execute({
          userId: input.userId,
          videoId: input.video.id!,
          videoPath: input.videoPath,
          title: publishTitle,
          privacyLevel: 'SELF_ONLY',
          disableComment: false,
          disableDuet: true,
          disableStitch: true,
          brandContentToggle: false,
          brandOrganicToggle: false,
        }),
        2,
      ),
      this.withRetry(
        'publish to YouTube',
        () => this.uploadVideoUseCase.execute({
          userId: input.userId,
          videoId: input.video.id!,
          videoPath: input.videoPath,
          title: publishTitle,
        }),
        2,
      ),
    ]);

    const failedResults = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    if (failedResults.length === results.length) {
      throw new Error(
        `All publish targets failed: ${failedResults
          .map((result) => getErrorMessage(result.reason))
          .join(' | ')}`,
      );
    }

    for (const result of failedResults) {
      console.error('[automation][publish] target failed:', result.reason);
    }
  }

  private async withRetry<T>(
    label: string,
    operation: () => Promise<T>,
    attempts = DEFAULT_STEP_ATTEMPTS,
  ): Promise<T> {
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt >= attempts) {
          break;
        }

        console.warn(
          `[automation][${label}] attempt ${attempt} failed; retrying...`,
          error,
        );
        await sleep(1_000 * attempt);
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error(`Failed to ${label}.`);
  }
}
