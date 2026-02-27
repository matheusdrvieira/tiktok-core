import { PrismaService } from '../../../../shared/database/prisma.service';
import { QuizzesService } from '../../infra/http/services/quizzes.service';
import { UpdateQuizUseCase } from '../use-cases/update-quiz.use-case';

export const makeUpdateQuizUseCase = () => {
  const prisma = new PrismaService();
  const quizzesService = new QuizzesService(prisma);
  return new UpdateQuizUseCase(quizzesService);
};
