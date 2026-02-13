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
        videoPath: body.videoPath,
        title: body.title,
        privacyLevel: body.privacyLevel,
        disableComment: body.disableComment,
        disableDuet: body.disableDuet,
        disableStitch: body.disableStitch,
      });
    },
    {
      body: t.Object({
        videoPath: t.String({ minLength: 1 }),
        title: t.Optional(t.String()),
        privacyLevel: t.Optional(t.String()),
        disableComment: t.Optional(t.Boolean()),
        disableDuet: t.Optional(t.Boolean()),
        disableStitch: t.Optional(t.Boolean()),
      }),
      auth: true,
    },
  );
