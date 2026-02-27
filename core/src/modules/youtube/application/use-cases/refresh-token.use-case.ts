import { YoutubeRepository } from '../../domain/repositories/youtube.repository';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../../domain/types/types';

export class RefreshTokenUseCase {
  constructor(private readonly repository: YoutubeRepository) { }

  async execute(props: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return await this.repository.refreshToken(props);
  }
}
