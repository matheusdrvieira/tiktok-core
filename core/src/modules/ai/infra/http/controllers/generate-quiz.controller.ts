import { Elysia, t } from 'elysia';
import { makeGenerateQuizUseCase } from '../../../application/factory/make-generate-quiz-use-case.factory';

const generateQuizUseCase = makeGenerateQuizUseCase();

export const generateQuizController = new Elysia()
  .post(
    '/ai/quiz/generate',
    async ({ body }) => {
      return await generateQuizUseCase.execute(body);
    },
    {
      body: t.Object({
        niche: t.String({ minLength: 1 }),
        reference: t.String({ minLength: 1 }),
        questionsCount: t.Number({ minimum: 4, maximum: 10 }),
      }),
    },
  );
