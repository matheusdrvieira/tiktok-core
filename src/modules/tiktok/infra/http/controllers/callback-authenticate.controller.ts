import { Elysia, redirect, t } from 'elysia';
import { env } from '../../../../../shared/config/env';
import { makeAuthenticateUseCase } from '../../../application/factory/make-authenticate-use-case.factory';

const authenticateUseCase = makeAuthenticateUseCase();

export const callbackAuthenticateController = new Elysia()
  .get(
    '/tiktok/auth/callback',
    async ({ query }) => {
      await authenticateUseCase.callback(query.code, query.state);
      return redirect(`${env.FRONTEND_URL}/integrations`);
    },
    {
      query: t.Object({
        code: t.String({ minLength: 1 }),
        state: t.String({ minLength: 1 }),
      }),
    },
  );
