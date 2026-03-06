import axios from 'axios';
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  Integration,
  IntegrationProvider,
} from '../../../integrations/domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../../integrations/domain/repositories/integrations.repository';
import { VideoStatus } from '../../../videos/domain/entities/videos.entity';
import { VideosRepository } from '../../../videos/domain/repositories/videos.repository';
import { TiktokRepository } from '../../domain/repositories/tiktok.repository';
import { DirectPostRequest, DirectPostResponse } from '../../domain/types/types';

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const resolveVideoPath = async (
  videoPath: string,
): Promise<{
  path: string;
  cleanup: () => Promise<void>;
}> => {
  if (!isHttpUrl(videoPath)) {
    return {
      path: videoPath,
      cleanup: async () => undefined,
    };
  }

  const tempDir = await mkdtemp(path.join(tmpdir(), 'quizzio-tiktok-upload-'));
  const tempPath = path.join(tempDir, 'rendered-video.mp4');

  const response = await axios.get(videoPath, {
    responseType: 'arraybuffer',
    timeout: 0,
  });

  await writeFile(tempPath, Buffer.from(response.data as ArrayBuffer));

  return {
    path: tempPath,
    cleanup: async () => {
      await rm(tempDir, { recursive: true, force: true });
    },
  };
};

export class DirectPostUseCase {
  constructor(
    private readonly tiktokRepository: TiktokRepository,
    private readonly integrationsRepository: IntegrationsRepository,
    private readonly videosRepository: VideosRepository,
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
    const creatorInfo = await this.tiktokRepository.queryCreatorInfo({
      accessToken: refreshedToken.accessToken,
    });

    if (!creatorInfo.canPost) {
      throw new Error(
        creatorInfo.canPostErrorMessage ??
        'Esta conta TikTok não pode publicar no momento. Tente novamente mais tarde.',
      );
    }

    const videoSource = await resolveVideoPath(props.videoPath);

    try {
      const fileStat = await stat(videoSource.path);

      if (!fileStat.size || fileStat.size <= 0) {
        throw new Error('Video file is empty');
      }

      const { publishId, uploadUrl } = await this.tiktokRepository.initDirectPost({
        accessToken: refreshedToken.accessToken,
        title: props.title,
        videoSize: fileStat.size,
        privacyLevel: props.privacyLevel,
        disableComment: props.disableComment,
        disableDuet: props.disableDuet,
        disableStitch: props.disableStitch,
        brandContentToggle: props.brandContentToggle,
        brandOrganicToggle: props.brandOrganicToggle,
      });

      if (!publishId || !uploadUrl) {
        throw new Error("TikTok init missing publish_id/upload_url",);
      }

      await this.tiktokRepository.uploadDirectPostVideo({
        uploadUrl,
        videoPath: videoSource.path,
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

      if (props.videoId) {
        await this.videosRepository.updateStatus(
          props.userId,
          props.videoId,
          VideoStatus.PUBLISHED,
        );
      }

      return {
        publishId,
        uploadUrl,
      };
    } finally {
      await videoSource.cleanup();
    }
  }
}
