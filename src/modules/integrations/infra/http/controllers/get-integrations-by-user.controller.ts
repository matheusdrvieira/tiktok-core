import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeFindIntegrationsByUserUseCase } from '../../../application/factory/make-find-integrations-by-user-use-case.factory';
import { IntegrationProvider } from '../../../domain/entities/integrations.entity';

const findIntegrationsByUserUseCase = makeFindIntegrationsByUserUseCase();

export const getIntegrationsByUserController = new Elysia()
  .use(authGuard)
  .get(
    '/tiktok/integrations/user/:userId',
    async ({ query, user }) => {
      return await findIntegrationsByUserUseCase.execute(user.id, query.provider);
    },
    {
      params: t.Object({
        userId: t.String({ minLength: 1 }),
      }),
      query: t.Object({
        provider: t.Enum(IntegrationProvider),
      }),
      auth: true,
    },
  );
