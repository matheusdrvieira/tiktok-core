import { Video } from '../../../domain/entities/videos.entity';

export class VideoPresenter {
  static toHttp(video: Video) {
    return {
      id: video.id,
      userId: video.userId,
      title: video.title,
      hashtags: video.hashtags,
      description: video.description,
      category: video.category,
      url: video.url,
      size: video.size,
      duration: video.duration,
      status: video.status,
      quizId: video.quizId,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }
}
