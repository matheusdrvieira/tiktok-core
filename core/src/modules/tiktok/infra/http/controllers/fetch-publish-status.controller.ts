import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeFetchPublishStatusUseCase } from '../../../application/factory/make-fetch-publish-status-use-case.factory';

const fetchPublishStatusUseCase = makeFetchPublishStatusUseCase();

export const fetchPublishStatusController = new Elysia().use(authGuard).get(
  '/tiktok/post/status/:publishId',
  async ({ params, user }) => {
    return await fetchPublishStatusUseCase.execute(user.id, params.publishId);
  },
  {
    params: t.Object({
      publishId: t.String({ minLength: 1 }),
    }),
    auth: true,
  },
);
