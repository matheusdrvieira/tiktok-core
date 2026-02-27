import { PrismaService } from '../../../../shared/database/prisma.service';
import { QuizzesService } from '../../infra/http/services/quizzes.service';
import { GetQuizByIdUseCase } from '../use-cases/get-quiz-by-id.use-case';

export const makeGetQuizByIdUseCase = () => {
  const prisma = new PrismaService();
  const quizzesService = new QuizzesService(prisma);
  return new GetQuizByIdUseCase(quizzesService);
};
