import { Elysia } from 'elysia';
import { makeGenerateQuizUseCase } from '../../../application/factory/make-generate-quiz-use-case.factory';

const generateQuizUseCase = makeGenerateQuizUseCase();

export const generateQuizController = new Elysia()
  .post('/ai/quiz/generate', async () => {
    return await generateQuizUseCase.execute();
  });
