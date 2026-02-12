import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeCreateVideoUseCase } from '../../../application/factory/make-create-video-use-case.factory';
import { Video } from '../../../domain/entities/videos.entity';

const createVideoUseCase = makeCreateVideoUseCase();

export const createVideoController = new Elysia()
  .use(authGuard)
  .post(
    '/tiktok/videos',
    async ({ body }) => {
      return await createVideoUseCase.execute(
        Video.create({
          userId: body.userId,
          url: body.url,
        }),
      );
    },
    {
      body: t.Object({
        userId: t.String({ minLength: 1 }),
        url: t.String({ minLength: 1, format: 'uri' }),
      }),
      auth: true,
    },
  );
