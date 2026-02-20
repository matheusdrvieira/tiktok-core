import { Video } from '../../domain/entities/videos.entity';
import { VideosRepository } from '../../domain/repositories/videos.repository';

export class FindVideosByUserUseCase {
  constructor(private readonly repository: VideosRepository) { }

  async execute(userId: string): Promise<Video[]> {
    return await this.repository.findByUserId(userId);
  }
}
