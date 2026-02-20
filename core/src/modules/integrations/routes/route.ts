import { Elysia } from 'elysia';
import { createIntegrationController } from '../infra/http/controllers/create-integration.controller';
import { getIntegrationsByUserController } from '../infra/http/controllers/get-integrations-by-user.controller';
import { listIntegrationsController } from '../infra/http/controllers/list-integrations.controller';

export const integrationsRoutes = new Elysia()
  .use(listIntegrationsController)
  .use(createIntegrationController)
  .use(getIntegrationsByUserController);
