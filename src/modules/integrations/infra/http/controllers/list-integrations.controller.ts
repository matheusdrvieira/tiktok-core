import { Elysia } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeListIntegrationsUseCase } from '../../../application/factory/make-list-integrations-use-case.factory';

const listIntegrationsUseCase = makeListIntegrationsUseCase();

export const listIntegrationsController = new Elysia()
  .use(authGuard)
  .get(
    '/tiktok/integrations',
    async ({ user }) => {
      return await listIntegrationsUseCase.execute(user.id);
    },
    {
      auth: true,
    },
  );
