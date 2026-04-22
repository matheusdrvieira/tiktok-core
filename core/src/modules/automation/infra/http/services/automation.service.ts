import { PrismaService } from '../../../../../shared/database/prisma.service';
import {
  buildQuestionHash,
  buildReferenceKey,
} from '../../../utils/question-signature';

export enum AutomationRunStatus {
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export enum AutomationRunStage {
  GENERATING_QUIZ = 'GENERATING_QUIZ',
  GENERATING_NARRATION = 'GENERATING_NARRATION',
  PERSISTING_QUIZ = 'PERSISTING_QUIZ',
  RENDERING = 'RENDERING',
  PUBLISHING = 'PUBLISHING',
  COMPLETED = 'COMPLETED',
}

type CreateAutomationRunInput = {
  userId: string;
  niche: string;
  reference: string;
};

type SaveQuestionHistoryInput = {
  userId: string;
  niche: string;
  reference: string;
  questions: Array<{
    id: string;
    question: string;
    options: Array<{
      text: string;
    }>;
    answer: {
      correctAnswerIndex: number;
    };
  }>;
};

export class AutomationService {
  constructor(private readonly prisma: PrismaService) { }

  async hasRunningRun(userId: string): Promise<boolean> {
    const recentRunWindowStartedAt = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const runningRunsCount = await this.prisma.automationRuns.count({
      where: {
        userId,
        status: AutomationRunStatus.RUNNING,
        createdAt: {
          gte: recentRunWindowStartedAt,
        },
      },
    });

    return runningRunsCount > 0;
  }

  async createRun(input: CreateAutomationRunInput) {
    return await this.prisma.automationRuns.create({
      data: {
        userId: input.userId,
        niche: input.niche,
        reference: input.reference,
        status: AutomationRunStatus.RUNNING,
        stage: AutomationRunStage.GENERATING_QUIZ,
      },
    });
  }

  async markStage(
    runId: string,
    stage: AutomationRunStage,
    attempt?: number,
  ): Promise<void> {
    await this.prisma.automationRuns.update({
      where: {
        id: runId,
      },
      data: {
        stage,
        attempt,
      },
    });
  }

  async attachQuizAndVideo(
    runId: string,
    data: {
      quizId: string;
      videoId: string;
    },
  ): Promise<void> {
    await this.prisma.automationRuns.update({
      where: {
        id: runId,
      },
      data,
    });
  }

  async markSucceeded(runId: string): Promise<void> {
    await this.prisma.automationRuns.update({
      where: {
        id: runId,
      },
      data: {
        status: AutomationRunStatus.SUCCEEDED,
        stage: AutomationRunStage.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  async markFailed(runId: string, error: string): Promise<void> {
    await this.prisma.automationRuns.update({
      where: {
        id: runId,
      },
      data: {
        status: AutomationRunStatus.FAILED,
        error,
        completedAt: new Date(),
      },
    });
  }

  async getExcludedQuestions(
    userId: string,
    niche: string,
    reference: string,
  ): Promise<string[]> {
    const referenceKey = buildReferenceKey(niche, reference);

    const [referenceHistory, recentQuestions] = await Promise.all([
      this.prisma.quizQuestionHistory.findMany({
        where: {
          userId,
          referenceKey,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
        select: {
          questionText: true,
        },
      }),
      this.prisma.quizQuestions.findMany({
        where: {
          quiz: {
            userId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
        select: {
          question: true,
        },
      }),
    ]);

    return Array.from(
      new Set([
        ...referenceHistory.map((item) => item.questionText),
        ...recentQuestions.map((item) => item.question),
      ]),
    );
  }

  async findDuplicateQuestions(
    userId: string,
    questions: string[],
  ): Promise<string[]> {
    const questionHashes = questions.map(buildQuestionHash);

    const [history, persistedQuestions] = await Promise.all([
      this.prisma.quizQuestionHistory.findMany({
        where: {
          userId,
          questionHash: {
            in: questionHashes,
          },
        },
        select: {
          questionHash: true,
        },
      }),
      this.prisma.quizQuestions.findMany({
        where: {
          quiz: {
            userId,
          },
        },
        select: {
          question: true,
        },
      }),
    ]);

    const duplicateHashes = new Set([
      ...history.map((item) => item.questionHash),
      ...persistedQuestions.map((item) => buildQuestionHash(item.question)),
    ]);

    return questions.filter((question) =>
      duplicateHashes.has(buildQuestionHash(question)),
    );
  }

  async saveQuestionHistory(input: SaveQuestionHistoryInput): Promise<void> {
    const referenceKey = buildReferenceKey(input.niche, input.reference);

    await this.prisma.quizQuestionHistory.createMany({
      data: input.questions.map((question) => ({
        userId: input.userId,
        niche: input.niche,
        reference: input.reference,
        referenceKey,
        questionText: question.question,
        questionHash: buildQuestionHash(question.question),
        correctAnswerText:
          question.options[question.answer.correctAnswerIndex]?.text,
        quizQuestionId: question.id,
      })),
    });
  }
}
