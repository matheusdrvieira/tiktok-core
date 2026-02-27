import { AsyncMaybe } from '../../../../../shared/core/domain/logic/maybe';
import { PrismaService } from '../../../../../shared/database/prisma.service';
import { QuizOption } from '../../../domain/entities/quiz-option.entity';
import { QuizQuestion } from '../../../domain/entities/quiz-question.entity';
import { QuizVideo } from '../../../domain/entities/quiz-video.entity';
import { Quiz } from '../../../domain/entities/quizzes.entity';
import { QuizzesRepository } from '../../../domain/repositories/quizzes.repository';

type QuizRecord = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  videos?: Array<{
    id: string;
    userId: string;
    title: string;
    hashtags: string[];
    description: string;
    category: string;
    url: string | null;
    size: bigint | null;
    duration: number | null;
    status: string;
    quizId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  questions: Array<{
    id: string;
    question: string;
    correctAnswerIndex: number;
    questionPath?: string | null;
    answerCorrectPath?: string | null;
    createdAt: Date;
    updatedAt: Date;
    options: Array<{
      id: string;
      text: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }>;
};

export class QuizzesService implements QuizzesRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(quiz: Quiz): Promise<Quiz> {
    const createdQuiz = await this.prisma.quizzes.create({
      data: {
        userId: quiz.userId,
        questions: {
          create: quiz.questions.map((question) => ({
            id: question.id,
            question: question.question,
            correctAnswerIndex: question.correctAnswerIndex,
            questionPath: question.questionPath,
            answerCorrectPath: question.answerCorrectPath,
            options: {
              create: question.options.map((option) => ({
                id: option.id,
                text: option.text,
              })),
            },
          })),
        },
      },
      include: {
        videos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        questions: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            options: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    return this.toDomain(createdQuiz);
  }

  async list(userId: string): Promise<Quiz[]> {
    const quizzes = await this.prisma.quizzes.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        videos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        questions: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            options: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    return quizzes.map((quiz) => this.toDomain(quiz));
  }

  async findById(userId: string, quizId: string): AsyncMaybe<Quiz> {
    const quiz = await this.prisma.quizzes.findFirst({
      where: {
        id: quizId,
        userId,
      },
      include: {
        videos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        questions: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            options: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return null;
    }

    return this.toDomain(quiz);
  }

  async update(userId: string, quizId: string, quiz: Quiz): AsyncMaybe<Quiz> {
    const existingQuiz = await this.prisma.quizzes.findFirst({
      where: {
        id: quizId,
        userId,
      },
      select: { id: true },
    });

    if (!existingQuiz) {
      return null;
    }

    const updatedQuiz = await this.prisma.quizzes.update({
      where: { id: quizId },
      data: {
        userId: quiz.userId,
        questions: {
          create: quiz.questions.map((question) => ({
            id: question.id,
            question: question.question,
            correctAnswerIndex: question.correctAnswerIndex,
            questionPath: question.questionPath,
            answerCorrectPath: question.answerCorrectPath,
            options: {
              create: question.options.map((option) => ({
                id: option.id,
                text: option.text,
              })),
            },
          })),
        },
      },
      include: {
        videos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        questions: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            options: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    return this.toDomain(updatedQuiz);
  }

  private toDomain(quiz: QuizRecord): Quiz {
    return Quiz.create({
      id: quiz.id,
      userId: quiz.userId,
      videos: (quiz.videos ?? []).map((video) =>
        QuizVideo.create({
          id: video.id,
          userId: video.userId,
          title: video.title,
          hashtags: video.hashtags,
          description: video.description,
          category: video.category,
          url: video.url ?? undefined,
          size: Number(video.size) ?? undefined,
          duration: video.duration ?? undefined,
          status: video.status,
          quizId: video.quizId,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
        }),
      ),
      questions: quiz.questions.map((question) =>
        QuizQuestion.create({
          id: question.id,
          question: question.question,
          correctAnswerIndex: question.correctAnswerIndex,
          questionPath: question.questionPath ?? undefined,
          answerCorrectPath: question.answerCorrectPath ?? undefined,
          options: question.options.map((option) =>
            QuizOption.create({
              id: option.id,
              text: option.text,
              createdAt: option.createdAt,
              updatedAt: option.updatedAt,
            }),
          ),
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        }),
      ),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });
  }
}
