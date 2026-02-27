import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeUpdateQuizUseCase } from '../../../application/factory/make-update-quiz-use-case.factory';
import { QuizOption } from '../../../domain/entities/quiz-option.entity';
import { QuizQuestion } from '../../../domain/entities/quiz-question.entity';
import { Quiz } from '../../../domain/entities/quizzes.entity';
import { QuizPresenter } from '../presenters/quiz.presenter';

const updateQuizUseCase = makeUpdateQuizUseCase();

const quizBodySchema = t.Object({
  questions: t.Array(
    t.Object({
      id: t.String({ minLength: 1 }),
      question: t.String({ minLength: 1 }),
      correctAnswerIndex: t.Number({ minimum: 0, maximum: 3 }),
      questionPath: t.Optional(t.String({ minLength: 1 })),
      answerCorrectPath: t.Optional(t.String({ minLength: 1 })),
      options: t.Array(
        t.Object({
          id: t.String({ minLength: 1 }),
          text: t.String({ minLength: 1 }),
        }),
        { minItems: 4, maxItems: 4 },
      ),
    }),
    { minItems: 1 },
  ),
});

export const updateQuizController = new Elysia()
  .use(authGuard)
  .put(
    '/quizzes/:quizId',
    async ({ params, body, user, set }) => {
      const quiz = await updateQuizUseCase.execute(
        user.id,
        params.quizId,
        Quiz.create({
          userId: user.id,
          id: params.quizId,
          questions: body.questions.map((question) =>
            QuizQuestion.create({
              id: question.id,
              question: question.question,
              correctAnswerIndex: question.correctAnswerIndex,
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
      body: quizBodySchema,
      auth: true,
    },
  );
