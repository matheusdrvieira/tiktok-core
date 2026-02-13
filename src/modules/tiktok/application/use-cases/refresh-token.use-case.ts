import { TiktokRepository } from '../../domain/repositories/tiktok.repository';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../../domain/types/types';

export class RefreshTokenUseCase {
  constructor(private readonly repository: TiktokRepository) { }

  async execute(props: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return await this.repository.refreshToken(props);
  }
}
