import { Video } from '../../../domain/entities/videos.entity';

export class VideoPresenter {
  static toHttp(video: Video) {
    return {
      id: video.id,
      userId: video.userId,
      name: video.name,
      url: video.url,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }
}
