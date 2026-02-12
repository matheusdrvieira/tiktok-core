import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeFindVideosByUserUseCase } from '../../../application/factory/make-find-videos-by-user-use-case.factory';

const findVideosByUserUseCase = makeFindVideosByUserUseCase();

export const getVideosByUserController = new Elysia()
  .use(authGuard)
  .get(
    '/tiktok/videos/user/:userId',
    async ({ user }) => {
      return await findVideosByUserUseCase.execute(user.id);
    },
    {
      params: t.Object({
        userId: t.String({ minLength: 1 }),
      }),
      auth: true,
    },
  );
