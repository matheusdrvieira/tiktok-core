import { Elysia, t } from 'elysia';
import { makeGenerateNarrationUseCase } from '../../../application/factory/make-generate-narration-use-case.factory';

const generateNarrationUseCase = makeGenerateNarrationUseCase();

export const generateNarrationController = new Elysia().post(
  '/ai/quiz/narration',
  async ({ body }) => {
    return await generateNarrationUseCase.execute({
      title: body.title,
      hashtags: body.hashtags,
      category: body.category,
      description: body.description,
      questions: body.questions,
    });
  },
  {
    body: t.Object({
      title: t.String({ minLength: 1 }),
      hashtags: t.String({ minLength: 1 }),
      category: t.Number({ minimum: 1 }),
      description: t.String({ minLength: 1 }),
      questions: t.Array(
        t.Object({
          id: t.String({ minLength: 1 }),
          question: t.String({ minLength: 1 }),
          options: t.Array(
            t.Object({
              id: t.String({ minLength: 1 }),
              text: t.String({ minLength: 1 }),
            }),
            { minItems: 4, maxItems: 4 },
          ),
          answer: t.Object({
            correctAnswerIndex: t.Number({ minimum: 0, maximum: 3 }),
          }),
        }),
        { minItems: 1 },
      ),
    }),
  },
);
