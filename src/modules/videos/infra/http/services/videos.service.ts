import { PrismaService } from '../../../../../shared/database/prisma.service';
import { Video } from '../../../domain/entities/videos.entity';
import { VideosRepository } from '../../../domain/repositories/videos.repository';

export class VideosService implements VideosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(props: Video): Promise<Video> {
    const video = await this.prisma.videos.create({
      data: {
        userId: props.userId,
        url: props.url,
      },
    });

    return Video.create({
      id: video.id,
      userId: video.userId,
      url: video.url,
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
        url: video.url,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      }),
    );
  }
}
