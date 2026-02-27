import { randomUUID } from 'node:crypto';
import { decryptJson, encryptJson } from '../../../../shared/utils/json-crypto';
import {
  Integration,
  IntegrationProvider,
} from '../../../integrations/domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../../integrations/domain/repositories/integrations.repository';
import { YoutubeRepository } from '../../domain/repositories/youtube.repository';
import { TokenResponse } from '../../domain/types/types';

export class AuthenticateUseCase {
  private readonly stateTtlMs = 10 * 60 * 1000;

  constructor(
    private readonly repository: YoutubeRepository,
    private readonly integrationsRepository: IntegrationsRepository,
  ) { }

  start(userId: string): string {
    const state = encryptJson({
      userId,
      nonce: randomUUID(),
      issuedAt: Date.now(),
    });

    return this.repository.getAuthorizationUrl(state);
  }

  async callback(code: string, state: string): Promise<TokenResponse> {
    const userId = this.resolveUserIdFromState(state);
    const token = await this.repository.exchangeCodeForToken(code);

    await this.integrationsRepository.create(
      Integration.create({
        userId,
        provider: IntegrationProvider.YOUTUBE,
        isActive: true,
        credentials: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresIn: token.expiresIn,
          scope: token.scope,
          tokenType: token.tokenType,
        },
      }),
    );

    return token;
  }

  private resolveUserIdFromState(state: string): string {
    const payload = decryptJson(state);
    const userId = payload.userId;
    const issuedAt = payload.issuedAt;

    if (typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error('Invalid OAuth state payload.');
    }

    if (typeof issuedAt !== 'number' || !Number.isFinite(issuedAt)) {
      throw new Error('Invalid OAuth state payload.');
    }

    if (Date.now() - issuedAt > this.stateTtlMs) {
      throw new Error('Expired OAuth state.');
    }

    return userId;
  }
}
