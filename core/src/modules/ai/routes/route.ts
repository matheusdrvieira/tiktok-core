import { Elysia } from 'elysia';
import { generateNarrationController } from '../infra/http/controllers/generate-narration.controller';
import { generateQuizController } from '../infra/http/controllers/generate-quiz.controller';
import { generateQuizVideoController } from '../infra/http/controllers/generate-quiz-video.controller';

export const aiRoutes = new Elysia()
  .use(generateNarrationController)
  .use(generateQuizController)
  .use(generateQuizVideoController);
