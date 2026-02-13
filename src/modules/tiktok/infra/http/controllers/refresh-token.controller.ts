import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeRefreshTokenUseCase } from '../../../application/factory/make-refresh-token-use-case.factory';

const refreshTokenUseCase = makeRefreshTokenUseCase();

export const refreshTokenController = new Elysia()
  .use(authGuard)
  .post(
    '/tiktok/auth/refresh',
    async ({ body }) => {
      return await refreshTokenUseCase.execute({
        refreshToken: body.refreshToken,
      });
    },
    {
      body: t.Object({
        refreshToken: t.String({ minLength: 10 }),
      }),
      auth: true,
    },
  );
