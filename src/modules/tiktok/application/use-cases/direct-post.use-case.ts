import { stat } from 'node:fs/promises';
import {
  Integration,
  IntegrationProvider,
} from '../../../integrations/domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../../integrations/domain/repositories/integrations.repository';
import { TiktokRepository } from '../../domain/repositories/tiktok.repository';
import { DirectPostRequest, DirectPostResponse } from '../../domain/types/types';

export class DirectPostUseCase {
  constructor(
    private readonly tiktokRepository: TiktokRepository,
    private readonly integrationsRepository: IntegrationsRepository,
  ) { }

  async execute(props: DirectPostRequest): Promise<DirectPostResponse> {
    const integration = await this.integrationsRepository.findByUserId(
      props.userId,
      IntegrationProvider.TIKTOK,
    );

    if (!integration) throw new Error('TikTok integration not found for user.');

    const refreshedToken = await this.tiktokRepository.refreshToken({
      refreshToken: integration?.credentials?.refreshToken as string
    });

    const fileStat = await stat(props.videoPath);

    if (!fileStat.size || fileStat.size <= 0) {
      throw new Error('Video file is empty');
    }

    const { publishId, uploadUrl } = await this.tiktokRepository.initDirectPost({
      accessToken: refreshedToken.accessToken,
      title: props.title,
      privacyLevel: props.privacyLevel,
      disableComment: props.disableComment,
      disableDuet: props.disableDuet,
      disableStitch: props.disableStitch,
    });

    if (!publishId || !uploadUrl) {
      throw new Error("TikTok init missing publish_id/upload_url",);
    }

    await this.tiktokRepository.uploadDirectPostVideo({
      uploadUrl,
      videoPath: props.videoPath,
      contentLength: fileStat.size,
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
          openId: refreshedToken.openId
        },
      }),
    );

    return {
      publishId,
      uploadUrl,
    };
  }
}
