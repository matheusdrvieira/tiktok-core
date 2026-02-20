import { Video } from '../entities/videos.entity';

export abstract class VideosRepository {
  abstract create(props: Video): Promise<Video>;
  abstract findByUserId(userId: string): Promise<Video[]>;
}
