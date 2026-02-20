import { Elysia } from 'elysia';
import { callbackAuthenticateController } from '../infra/http/controllers/callback-authenticate.controller';
import { directPostController } from '../infra/http/controllers/direct-post.controller';
import { queryCreatorInfoController } from '../infra/http/controllers/query-creator-info.controller';
import { refreshTokenController } from '../infra/http/controllers/refresh-token.controller';
import { startAuthenticateController } from '../infra/http/controllers/start-authenticate.controller';

export const tiktokRoutes = new Elysia()
  .use(startAuthenticateController)
  .use(callbackAuthenticateController)
  .use(refreshTokenController)
  .use(queryCreatorInfoController)
  .use(directPostController);
