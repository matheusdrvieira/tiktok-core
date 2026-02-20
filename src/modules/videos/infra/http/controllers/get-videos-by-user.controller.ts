import { Elysia } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeFindVideosByUserUseCase } from '../../../application/factory/make-find-videos-by-user-use-case.factory';
import { VideoPresenter } from '../presenters/video.presenter';

const findVideosByUserUseCase = makeFindVideosByUserUseCase();

export const getVideosByUserController = new Elysia()
  .use(authGuard)
  .get(
    '/tiktok/videos/user',
    async ({ user }) => {
      const videos = await findVideosByUserUseCase.execute(user.id);
      return videos.map(VideoPresenter.toHttp);
    },
    {
      auth: true,
    },
  );
