import { Elysia, redirect } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeAuthenticateUseCase } from '../../../application/factory/make-authenticate-use-case.factory';

const authenticateUseCase = makeAuthenticateUseCase();

export const startAuthenticateController = new Elysia()
  .use(authGuard)
  .get(
    '/tiktok/auth/start',
    async ({ user }) => {
      return redirect(authenticateUseCase.start(user.id));
    },
    {
      auth: true,
    },
  );
