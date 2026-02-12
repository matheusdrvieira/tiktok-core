import { Elysia } from 'elysia';
import { createVideoController } from '../infra/http/controllers/create-video.controller';
import { getVideosByUserController } from '../infra/http/controllers/get-videos-by-user.controller';

export const videosRoutes = new Elysia()
  .use(createVideoController)
  .use(getVideosByUserController);
