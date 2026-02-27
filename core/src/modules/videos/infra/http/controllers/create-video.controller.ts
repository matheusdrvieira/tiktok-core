import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeCreateVideoUseCase } from '../../../application/factory/make-create-video-use-case.factory';
import { Video, VideoStatus } from '../../../domain/entities/videos.entity';
import { VideoPresenter } from '../presenters/video.presenter';

const createVideoUseCase = makeCreateVideoUseCase();

export const createVideoController = new Elysia()
  .use(authGuard)
  .post(
    '/videos',
    async ({ body, user }) => {
      const video = await createVideoUseCase.execute(
        Video.create({
          userId: user.id,
          title: body.title,
          hashtags: body.hashtags,
          description: body.description,
          category: body.category,
          url: body.url,
          status: VideoStatus.RENDERED,
          quizId: body.quizId,
        }),
      );
      return VideoPresenter.toHttp(video);
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
        hashtags: t.Array(t.String({ minLength: 1 })),
        description: t.String({ minLength: 1 }),
        category: t.String({ minLength: 1 }),
        url: t.String({ minLength: 1, format: 'uri' }),
        quizId: t.String({ minLength: 1 }),
      }),
      auth: true,
    },
  );
