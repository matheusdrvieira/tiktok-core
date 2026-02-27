import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeGetQuizByIdUseCase } from '../../../application/factory/make-get-quiz-by-id-use-case.factory';
import { QuizPresenter } from '../presenters/quiz.presenter';

const getQuizByIdUseCase = makeGetQuizByIdUseCase();

export const getQuizByIdController = new Elysia()
  .use(authGuard)
  .get(
    '/quizzes/:quizId',
    async ({ params, user, set }) => {
      const quiz = await getQuizByIdUseCase.execute(user.id, params.quizId);

      if (!quiz) {
        set.status = 404;
        return { message: 'Quiz não encontrado.' };
      }

      return QuizPresenter.toHttp(quiz);
    },
    {
      params: t.Object({
        quizId: t.String({ minLength: 1 }),
      }),
      auth: true,
    },
  );
