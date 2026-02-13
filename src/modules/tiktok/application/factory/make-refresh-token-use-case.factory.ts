import { TiktokService } from '../../infra/http/services/tiktok.service';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';

export const makeRefreshTokenUseCase = () => {
  const tiktokService = new TiktokService();

  return new RefreshTokenUseCase(tiktokService);
};
