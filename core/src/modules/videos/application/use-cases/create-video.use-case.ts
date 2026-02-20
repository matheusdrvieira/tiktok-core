import { Video } from '../../domain/entities/videos.entity';
import { VideosRepository } from '../../domain/repositories/videos.repository';

export class CreateVideoUseCase {
  constructor(private readonly repository: VideosRepository) {}

  async execute(props: Video): Promise<Video> {
    return await this.repository.create(props);
  }
}
