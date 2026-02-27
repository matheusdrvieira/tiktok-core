import { Elysia, t } from 'elysia';
import { randomUUID } from 'node:crypto';
import { env } from '../../../../../shared/config/env';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeUploadFileUseCase } from '../../../../bucket/application/factory/make-upload-file-use-case.factory';
import { makeCreateVideoUseCase } from '../../../application/factory/make-create-video-use-case.factory';
import { Video, VideoStatus } from '../../../domain/entities/videos.entity';
import { VideoPresenter } from '../presenters/video.presenter';

const uploadFileUseCase = makeUploadFileUseCase();
const createVideoUseCase = makeCreateVideoUseCase();

export const uploadRenderedVideoController = new Elysia()
  .use(authGuard)
  .post(
    '/videos/upload',
    async ({ body, user, set }) => {
      const extension = body.file.type === 'video/mp4' ? 'mp4' : 'mp3';
      const key = `videos/${user.id}/${randomUUID()}.${extension}`;

      await uploadFileUseCase.execute({
        key,
        body: body.file,
        contentType: body.file.type,
      });

      const videoUrl = `${env.BACKEND_URL}/bucket/video?key=${encodeURIComponent(key)}`;
      const video = await createVideoUseCase.execute(
        Video.create({
          userId: user.id,
          title: body.title,
          hashtags: body.hashtags,
          description: body.description,
          category: body.category,
          url: videoUrl,
          status: VideoStatus.RENDERED,
          quizId: body.quizId,
        }),
      );

      set.status = 201;
      return {
        ...VideoPresenter.toHttp(video),
        key,
      };
    },
    {
      body: t.Object({
        file: t.File(),
        title: t.String({ minLength: 1 }),
        hashtags: t.Array(t.String({ minLength: 1 })),
        description: t.String({ minLength: 1 }),
        category: t.String({ minLength: 1 }),
        quizId: t.String({ minLength: 1 }),
      }),
      auth: true,
    },
  );
