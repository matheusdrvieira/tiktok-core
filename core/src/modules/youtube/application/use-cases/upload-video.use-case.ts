import axios from 'axios';
import { createWriteStream } from 'node:fs';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import {
  Integration,
  IntegrationProvider,
} from '../../../integrations/domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../../integrations/domain/repositories/integrations.repository';
import { VideoStatus } from '../../../videos/domain/entities/videos.entity';
import { VideosRepository } from '../../../videos/domain/repositories/videos.repository';
import { YoutubeRepository } from '../../domain/repositories/youtube.repository';
import { UploadVideoRequest, UploadVideoResponse } from '../../domain/types/types';

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

  const tempDir = await mkdtemp(path.join(tmpdir(), 'quizzio-youtube-upload-'));
  const tempPath = path.join(tempDir, 'rendered-video.mp4');

  const response = await axios.get(videoPath, {
    responseType: 'stream',
    timeout: 0,
  });

  await pipeline(response.data, createWriteStream(tempPath));

  return {
    path: tempPath,
    cleanup: async () => {
      await rm(tempDir, { recursive: true, force: true });
    },
  };
};

const buildYoutubeMetadata = (value: string): {
  title: string;
  description: string;
  tags: string[];
} => {
  const lines = value
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const firstLine = lines[0] ?? value.trim();
  const title = (firstLine.length > 0 ? firstLine : 'Quiz').slice(0, 100);
  // Keep hashtags out of description; they should be sent only via tags.
  const description = title.slice(0, 5000);
  const hashtagsSource = lines.slice(1).join(' ');
  const tags = Array.from(
    new Set(
      (hashtagsSource.match(/#([^\s#]+)/g) ?? [])
        .map((tag) => tag.replace(/^#/, '').trim())
        .filter((tag) => tag.length > 0),
    ),
  ).slice(0, 15);

  return {
    title,
    description,
    tags,
  };
};

export class UploadVideoUseCase {
  constructor(
    private readonly youtubeRepository: YoutubeRepository,
    private readonly integrationsRepository: IntegrationsRepository,
    private readonly videosRepository: VideosRepository,
  ) { }

  async execute(props: UploadVideoRequest): Promise<UploadVideoResponse> {
    const integration = await this.integrationsRepository.findByUserId(
      props.userId,
      IntegrationProvider.YOUTUBE,
    );

    if (!integration) throw new Error('YouTube integration not found for user.');

    const refreshToken = integration?.credentials?.refreshToken;

    if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
      throw new Error('YouTube integration has no refresh token.');
    }

    const refreshedToken = await this.youtubeRepository.refreshToken({
      refreshToken,
    });

    const effectiveRefreshToken = refreshedToken.refreshToken ?? refreshToken;
    const videoSource = await resolveVideoPath(props.videoPath);

    try {
      const fileStat = await stat(videoSource.path);

      if (!fileStat.size || fileStat.size <= 0) {
        throw new Error('Video file is empty');
      }

      const metadata = buildYoutubeMetadata(props.title);
      const { videoId } = await this.youtubeRepository.uploadVideo({
        accessToken: refreshedToken.accessToken,
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        videoPath: videoSource.path,
        videoSize: fileStat.size,
        privacyStatus: 'public',
      });

      await this.integrationsRepository.create(
        Integration.create({
          userId: integration.userId,
          provider: IntegrationProvider.YOUTUBE,
          isActive: integration.isActive ?? true,
          credentials: {
            ...integration.credentials,
            accessToken: refreshedToken.accessToken,
            refreshToken: effectiveRefreshToken,
            expiresIn: refreshedToken.expiresIn,
            scope: refreshedToken.scope ?? integration.credentials.scope,
            tokenType: refreshedToken.tokenType ?? integration.credentials.tokenType,
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
        videoId,
      };
    } finally {
      await videoSource.cleanup();
    }
  }
}
