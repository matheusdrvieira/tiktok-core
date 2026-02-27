import { Video } from '../entities/videos.entity';
import { AsyncMaybe } from '../../../../shared/core/domain/logic/maybe';
import { VideoStatus } from '../entities/videos.entity';

export abstract class VideosRepository {
  abstract create(props: Video): Promise<Video>;
  abstract findByUserId(userId: string): Promise<Video[]>;
  abstract updateUrl(
    userId: string,
    videoId: string,
    metadata: {
      url: string;
      size?: number;
      duration?: number;
      status: VideoStatus;
    },
  ): AsyncMaybe<Video>;
  abstract updateStatus(
    userId: string,
    videoId: string,
    status: VideoStatus,
  ): AsyncMaybe<Video>;
  abstract update(
    userId: string,
    videoId: string,
    metadata: {
      title: string;
      hashtags: string[];
      description: string;
      category: string;
      quizId: string;
    },
  ): AsyncMaybe<Video>;
}
