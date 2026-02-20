import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeCreateIntegrationUseCase } from '../../../application/factory/make-create-integration-use-case.factory';
import {
  Integration,
  IntegrationProvider,
} from '../../../domain/entities/integrations.entity';
import { IntegrationPresenter } from '../presenters/integration.presenter';

const createIntegrationUseCase = makeCreateIntegrationUseCase();

export const createIntegrationController = new Elysia()
  .use(authGuard)
  .post('/integrations',
    async ({ body, user }) => {
      const integration = await createIntegrationUseCase.execute(
        Integration.create({
          userId: user.id,
          provider: body.provider,
          isActive: body.isActive,
          credentials: body.credentials,
        }),
      );

      return IntegrationPresenter.toHttp(integration);
    },
    {
      body: t.Object({
        provider: t.Enum(IntegrationProvider),
        isActive: t.Optional(t.Boolean()),
        credentials: t.Object({}, { additionalProperties: true }),
      }),
      auth: true
    },
  );
