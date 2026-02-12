import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeCreateIntegrationUseCase } from '../../../application/factory/make-create-integration-use-case.factory';
import {
  Integration,
  IntegrationProvider,
} from '../../../domain/entities/integrations.entity';

const createIntegrationUseCase = makeCreateIntegrationUseCase();

export const createIntegrationController = new Elysia()
  .use(authGuard)
  .post('/tiktok/integrations',
    async ({ body }) => {
      return await createIntegrationUseCase.execute(
        Integration.create({
          userId: body.userId,
          provider: body.provider,
          isActive: body.isActive,
          credentials: body.credentials,
        }),
      );
    },
    {
      body: t.Object({
        userId: t.String({ minLength: 1 }),
        provider: t.Enum(IntegrationProvider),
        isActive: t.Optional(t.Boolean()),
        credentials: t.Object({}, { additionalProperties: true }),
      }),
      auth: true
    },
  );
