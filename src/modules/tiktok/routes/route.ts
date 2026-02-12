import { Elysia } from 'elysia';
import { callbackAuthenticateController } from '../infra/http/controllers/callback-authenticate.controller';
import { startAuthenticateController } from '../infra/http/controllers/start-authenticate.controller';

export const tiktokRoutes = new Elysia()
  .use(startAuthenticateController)
  .use(callbackAuthenticateController);
