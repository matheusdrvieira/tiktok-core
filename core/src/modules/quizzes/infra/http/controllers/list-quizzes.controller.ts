import { Elysia } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeListQuizzesUseCase } from '../../../application/factory/make-list-quizzes-use-case.factory';
import { QuizPresenter } from '../presenters/quiz.presenter';

const listQuizzesUseCase = makeListQuizzesUseCase();

export const listQuizzesController = new Elysia()
  .use(authGuard)
  .get(
    '/quizzes',
    async ({ user }) => {
      const quizzes = await listQuizzesUseCase.execute(user.id);
      return quizzes.map(QuizPresenter.toHttp);
    },
    {
      auth: true,
    },
  );
