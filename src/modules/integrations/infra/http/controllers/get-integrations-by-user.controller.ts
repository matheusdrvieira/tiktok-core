import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeFindIntegrationsByUserUseCase } from '../../../application/factory/make-find-integrations-by-user-use-case.factory';

const findIntegrationsByUserUseCase = makeFindIntegrationsByUserUseCase();

export const getIntegrationsByUserController = new Elysia()
  .use(authGuard)
  .get(
    '/tiktok/integrations/user/:userId',
    async ({ user }) => {
      return await findIntegrationsByUserUseCase.execute(user.id);
    },
    {
      params: t.Object({
        userId: t.String({ minLength: 1 }),
      }),
      auth: true,
    },
  );
