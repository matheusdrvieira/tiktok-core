import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeUpdateVideoUseCase } from '../../../application/factory/make-update-video-metadata-use-case.factory';
import { VideoPresenter } from '../presenters/video.presenter';

const updateVideoUseCase = makeUpdateVideoUseCase();

export const updateVideoController = new Elysia()
  .use(authGuard)
  .put(
    '/videos/:videoId',
    async ({ user, params, body, set }) => {
      const video = await updateVideoUseCase.execute(user.id, params.videoId, {
        title: body.title,
        hashtags: body.hashtags,
        description: body.description,
        category: body.category,
        quizId: body.quizId,
      });

      if (!video) {
        set.status = 404;
        return { message: 'Vídeo não encontrado.' };
      }

      return VideoPresenter.toHttp(video);
    },
    {
      params: t.Object({
        videoId: t.String({ minLength: 1 }),
      }),
      body: t.Object({
        title: t.String({ minLength: 1 }),
        hashtags: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
        description: t.String({ minLength: 1 }),
        category: t.String({ minLength: 1 }),
        quizId: t.String({ minLength: 1 }),
      }),
      auth: true,
    },
  );
