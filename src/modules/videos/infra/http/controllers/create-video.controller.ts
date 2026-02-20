import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeCreateVideoUseCase } from '../../../application/factory/make-create-video-use-case.factory';
import { Video } from '../../../domain/entities/videos.entity';
import { VideoPresenter } from '../presenters/video.presenter';

const createVideoUseCase = makeCreateVideoUseCase();

export const createVideoController = new Elysia()
  .use(authGuard)
  .post(
    '/tiktok/videos',
    async ({ body, user }) => {
      const video = await createVideoUseCase.execute(
        Video.create({
          userId: user.id,
          name: body.name,
          url: body.url,
        }),
      );
      return VideoPresenter.toHttp(video);
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        url: t.String({ minLength: 1, format: 'uri' }),
      }),
      auth: true,
    },
  );
