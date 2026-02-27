import { AsyncMaybe } from "../../../../shared/core/domain/logic/maybe";
import { Video } from "../../domain/entities/videos.entity";
import { VideosRepository } from "../../domain/repositories/videos.repository";
import { VideoStatus } from "../../domain/entities/videos.entity";

export class UpdateVideoUrlUseCase {
  constructor(private readonly repository: VideosRepository) { }

  async execute(
    userId: string,
    videoId: string,
    metadata: {
      url: string;
      size?: number;
      duration?: number;
      status: VideoStatus;
    },
  ): AsyncMaybe<Video> {
    return await this.repository.updateUrl(userId, videoId, metadata);
  }
}
