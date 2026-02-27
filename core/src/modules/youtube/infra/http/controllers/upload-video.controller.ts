import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeUploadVideoUseCase } from '../../../application/factory/make-upload-video-use-case.factory';

const uploadVideoUseCase = makeUploadVideoUseCase();

export const uploadVideoController = new Elysia()
  .use(authGuard)
  .post(
    '/youtube/post/upload',
    async ({ body, user }) => {
      return await uploadVideoUseCase.execute({
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
