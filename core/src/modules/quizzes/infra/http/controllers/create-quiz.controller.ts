import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeCreateQuizUseCase } from '../../../application/factory/make-create-quiz-use-case.factory';
import { QuizOption } from '../../../domain/entities/quiz-option.entity';
import { QuizQuestion } from '../../../domain/entities/quiz-question.entity';
import { Quiz } from '../../../domain/entities/quizzes.entity';
import { QuizPresenter } from '../presenters/quiz.presenter';

const createQuizUseCase = makeCreateQuizUseCase();

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

export const createQuizController = new Elysia()
  .use(authGuard)
  .post(
    '/quizzes',
    async ({ body, user, set }) => {
      const quiz = await createQuizUseCase.execute(
        Quiz.create({
          userId: user.id,
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

      set.status = 201;
      return QuizPresenter.toHttp(quiz);
    },
    {
      body: quizBodySchema,
      auth: true,
    },
  );
