import { PrismaService } from '../../../../shared/database/prisma.service';
import { QuizzesService } from '../../infra/http/services/quizzes.service';
import { ListQuizzesUseCase } from '../use-cases/list-quizzes.use-case';

export const makeListQuizzesUseCase = () => {
  const prisma = new PrismaService();
  const quizzesService = new QuizzesService(prisma);
  return new ListQuizzesUseCase(quizzesService);
};
