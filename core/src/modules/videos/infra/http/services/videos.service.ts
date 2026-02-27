import { AsyncMaybe } from '../../../../../shared/core/domain/logic/maybe';
import { PrismaService } from '../../../../../shared/database/prisma.service';
import { Video, VideoStatus } from '../../../domain/entities/videos.entity';
import { VideosRepository } from '../../../domain/repositories/videos.repository';

export class VideosService implements VideosRepository {
  constructor(private readonly prisma: PrismaService) { }

  async updateUrl(
    userId: string,
    videoId: string,
    metadata: {
      url: string;
      size?: number;
      duration?: number;
      status: VideoStatus;
    },
  ): AsyncMaybe<Video> {
    const updatedVideo = await this.prisma.videos.update({
      where: {
        id: videoId,
        userId: userId
      },
      data: {
        url: metadata.url,
        size: metadata.size,
        duration: metadata.duration,
        status: metadata.status,
      },
    });

    return Video.create({
      id: updatedVideo.id,
      userId: updatedVideo.userId,
      title: updatedVideo.title,
      hashtags: updatedVideo.hashtags,
      description: updatedVideo.description,
      category: updatedVideo.category,
      url: updatedVideo.url ?? undefined,
      size: Number(updatedVideo.size) ?? undefined,
      duration: updatedVideo.duration ?? undefined,
      status: VideoStatus[updatedVideo.status],
      quizId: updatedVideo.quizId,
      createdAt: updatedVideo.createdAt,
      updatedAt: updatedVideo.updatedAt,
    });
  }

  async updateStatus(
    userId: string,
    videoId: string,
    status: VideoStatus,
  ): AsyncMaybe<Video> {
    const updatedVideo = await this.prisma.videos.update({
      where: {
        id: videoId,
        userId,
      },
      data: {
        status,
      },
    });

    return Video.create({
      id: updatedVideo.id,
      userId: updatedVideo.userId,
      title: updatedVideo.title,
      hashtags: updatedVideo.hashtags,
      description: updatedVideo.description,
      category: updatedVideo.category,
      url: updatedVideo.url ?? undefined,
      size: Number(updatedVideo.size) ?? undefined,
      duration: updatedVideo.duration ?? undefined,
      status: VideoStatus[updatedVideo.status],
      quizId: updatedVideo.quizId,
      createdAt: updatedVideo.createdAt,
      updatedAt: updatedVideo.updatedAt,
    });
  }

  async create(props: Video): Promise<Video> {
    const video = await this.prisma.videos.create({
      data: {
        userId: props.userId,
        title: props.title,
        hashtags: props.hashtags,
        description: props.description,
        category: props.category,
        url: props.url,
        size: props.size,
        duration: props.duration,
        status: props.status,
        quizId: props.quizId,
      },
    });

    return Video.create({
      id: video.id,
      userId: video.userId,
      title: video.title,
      hashtags: video.hashtags,
      description: video.description,
      category: video.category,
      url: video.url ?? undefined,
      size: Number(video.size) ?? undefined,
      duration: video.duration ?? undefined,
      status: VideoStatus[video.status],
      quizId: video.quizId,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Video[]> {
    const videos = await this.prisma.videos.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return videos.map((video) =>
      Video.create({
        id: video.id,
        userId: video.userId,
        title: video.title,
        hashtags: video.hashtags,
        description: video.description,
        category: video.category,
        url: video.url ?? undefined,
        size: Number(video.size) ?? undefined,
        duration: video.duration ?? undefined,
        status: VideoStatus[video.status],
        quizId: video.quizId,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      }),
    );
  }

  async update(
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
    const updatedVideo = await this.prisma.videos.upsert({
      where: {
        id: videoId,
        userId: userId
      },
      update: {
        title: metadata.title,
        hashtags: metadata.hashtags,
        description: metadata.description,
        category: metadata.category,
      },
      create: {
        id: videoId,
        userId,
        quizId: metadata.quizId,
        title: metadata.title,
        hashtags: metadata.hashtags,
        description: metadata.description,
        category: metadata.category,
      },
    });

    return Video.create({
      id: updatedVideo.id,
      userId: updatedVideo.userId,
      title: updatedVideo.title,
      hashtags: updatedVideo.hashtags,
      description: updatedVideo.description,
      category: updatedVideo.category,
      url: updatedVideo.url ?? undefined,
      size: Number(updatedVideo.size) ?? undefined,
      duration: updatedVideo.duration ?? undefined,
      status: VideoStatus[updatedVideo.status],
      quizId: updatedVideo.quizId,
      createdAt: updatedVideo.createdAt,
      updatedAt: updatedVideo.updatedAt,
    });
  }
}
