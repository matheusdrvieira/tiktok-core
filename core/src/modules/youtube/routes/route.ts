import { Elysia } from 'elysia';
import { callbackAuthenticateController } from '../infra/http/controllers/callback-authenticate.controller';
import { refreshTokenController } from '../infra/http/controllers/refresh-token.controller';
import { startAuthenticateController } from '../infra/http/controllers/start-authenticate.controller';
import { uploadVideoController } from '../infra/http/controllers/upload-video.controller';

export const youtubeRoutes = new Elysia()
  .use(startAuthenticateController)
  .use(callbackAuthenticateController)
  .use(refreshTokenController)
  .use(uploadVideoController);
