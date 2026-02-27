import { YoutubeService } from '../../infra/http/services/youtube.service';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';

export const makeRefreshTokenUseCase = () => {
  const youtubeService = new YoutubeService();

  return new RefreshTokenUseCase(youtubeService);
};
