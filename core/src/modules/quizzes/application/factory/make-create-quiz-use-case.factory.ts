import { PrismaService } from '../../../../shared/database/prisma.service';
import { QuizzesService } from '../../infra/http/services/quizzes.service';
import { CreateQuizUseCase } from '../use-cases/create-quiz.use-case';

export const makeCreateQuizUseCase = () => {
  const prisma = new PrismaService();
  const quizzesService = new QuizzesService(prisma);
  return new CreateQuizUseCase(quizzesService);
};
