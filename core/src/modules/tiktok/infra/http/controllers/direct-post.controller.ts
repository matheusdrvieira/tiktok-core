import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeDirectPostUseCase } from '../../../application/factory/make-direct-post-use-case.factory';

const directPostUseCase = makeDirectPostUseCase();

export const directPostController = new Elysia()
  .use(authGuard)
  .post(
    '/tiktok/post/direct',
    async ({ body, user }) => {
      return await directPostUseCase.execute({
        userId: user.id,
        videoId: body.videoId,
        videoPath: body.videoPath,
        title: body.title,
      });
    },
    {
      body: t.Object({
        videoId: t.Optional(t.String({ minLength: 1 })),
        videoPath: t.String({ minLength: 1 }),
        title: t.String({ minLength: 1 }),
      }),
      auth: true,
    },
  );
