import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeFindIntegrationsByUserUseCase } from '../../../application/factory/make-find-integrations-by-user-use-case.factory';
import { IntegrationProvider } from '../../../domain/entities/integrations.entity';
import { IntegrationPresenter } from '../presenters/integration.presenter';

const findIntegrationsByUserUseCase = makeFindIntegrationsByUserUseCase();

export const getIntegrationsByUserController = new Elysia()
  .use(authGuard)
  .get('/integrations/:provider',
    async ({ params, user }) => {
      const integration = await findIntegrationsByUserUseCase.execute(user.id, params.provider);

      if (!integration) return null;

      return IntegrationPresenter.toHttp(integration);
    },
    {
      params: t.Object({
        provider: t
          .Transform(t.String({ minLength: 1 }))
          .Decode((value) => value.toUpperCase() as IntegrationProvider)
          .Encode((value) => value)
      }),
      auth: true,
    },
  );
