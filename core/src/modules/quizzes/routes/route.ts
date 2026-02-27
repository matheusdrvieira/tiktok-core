import { Elysia } from 'elysia';
import { createQuizController } from '../infra/http/controllers/create-quiz.controller';
import { getQuizByIdController } from '../infra/http/controllers/get-quiz-by-id.controller';
import { listQuizzesController } from '../infra/http/controllers/list-quizzes.controller';
import { updateQuizController } from '../infra/http/controllers/update-quiz.controller';

export const quizzesRoutes = new Elysia()
  .use(listQuizzesController)
  .use(getQuizByIdController)
  .use(createQuizController)
  .use(updateQuizController);
