import { PrismaService } from '../../../../shared/database/prisma.service';
import { VideosService } from '../../infra/http/services/videos.service';
import { UpdateVideoUseCase } from '../use-cases/update-video-metadata.use-case';

export const makeUpdateVideoUseCase = () => {
  const prisma = new PrismaService();
  const videosService = new VideosService(prisma);
  return new UpdateVideoUseCase(videosService);
};
