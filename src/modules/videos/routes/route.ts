import { Elysia } from 'elysia';
import { createVideoController } from '../infra/http/controllers/create-video.controller';
import { getVideosByUserController } from '../infra/http/controllers/get-videos-by-user.controller';
import { uploadRenderedVideoController } from '../infra/http/controllers/upload-rendered-video.controller';

export const videosRoutes = new Elysia()
  .use(uploadRenderedVideoController)
  .use(createVideoController)
  .use(getVideosByUserController);
