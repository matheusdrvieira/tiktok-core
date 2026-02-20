import { Elysia } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeListIntegrationsUseCase } from '../../../application/factory/make-list-integrations-use-case.factory';
import { IntegrationPresenter } from '../presenters/integration.presenter';

const listIntegrationsUseCase = makeListIntegrationsUseCase();

export const listIntegrationsController = new Elysia()
  .use(authGuard)
  .get('/integrations',
    async ({ user }) => {
      const integrations = await listIntegrationsUseCase.execute(user.id);
      return integrations.map(IntegrationPresenter.toHttp);
    },
    { auth: true }
  );
