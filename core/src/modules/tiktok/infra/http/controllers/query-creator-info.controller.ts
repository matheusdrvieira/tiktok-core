import { Elysia } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeQueryCreatorInfoUseCase } from '../../../application/factory/make-query-creator-info-use-case.factory';

const queryCreatorInfoUseCase = makeQueryCreatorInfoUseCase();

export const queryCreatorInfoController = new Elysia()
  .use(authGuard)
  .get(
    '/tiktok/post/creator-info',
    async ({ user }) => {
      return await queryCreatorInfoUseCase.execute(user.id);
    },
    {
      auth: true,
    },
  );
