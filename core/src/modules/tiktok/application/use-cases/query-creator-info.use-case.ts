import {
  Integration,
  IntegrationProvider,
} from '../../../integrations/domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../../integrations/domain/repositories/integrations.repository';
import { TiktokRepository } from '../../domain/repositories/tiktok.repository';
import { CreatorInfoQueryOutput } from '../../domain/types/types';

export class QueryCreatorInfoUseCase {
  constructor(
    private readonly tiktokRepository: TiktokRepository,
    private readonly integrationsRepository: IntegrationsRepository,
  ) { }

  async execute(userId: string): Promise<CreatorInfoQueryOutput> {
    const integration = await this.integrationsRepository.findByUserId(
      userId,
      IntegrationProvider.TIKTOK,
    );

    if (!integration) throw new Error('TikTok integration not found for user.');

    const refreshedToken = await this.tiktokRepository.refreshToken({
      refreshToken: integration?.credentials?.refreshToken as string,
    });

    const creatorInfo = await this.tiktokRepository.queryCreatorInfo({
      accessToken: refreshedToken.accessToken,
    });

    await this.integrationsRepository.create(
      Integration.create({
        userId: integration.userId,
        provider: IntegrationProvider.TIKTOK,
        isActive: integration.isActive ?? true,
        credentials: {
          ...integration.credentials,
          accessToken: refreshedToken.accessToken,
          refreshToken: refreshedToken.refreshToken,
          expiresIn: refreshedToken.expiresIn,
          refreshExpiresIn: refreshedToken.refreshExpiresIn,
          openId: refreshedToken.openId,
        },
      }),
    );

    return creatorInfo;
  }
}
