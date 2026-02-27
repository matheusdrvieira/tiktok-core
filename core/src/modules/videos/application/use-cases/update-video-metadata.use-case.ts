import { VideosRepository } from '../../domain/repositories/videos.repository';
import { Video } from '../../domain/entities/videos.entity';
import { AsyncMaybe } from '../../../../shared/core/domain/logic/maybe';

export class UpdateVideoUseCase {
  constructor(private readonly repository: VideosRepository) {}

  async execute(
    userId: string,
    videoId: string,
    metadata: {
      title: string;
      hashtags: string[];
      description: string;
      category: string;
      quizId: string;
    },
  ): AsyncMaybe<Video> {
    return await this.repository.update(userId, videoId, metadata);
  }
}
