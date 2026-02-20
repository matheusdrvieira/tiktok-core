import { PrismaService } from '../../../../shared/database/prisma.service';
import { VideosService } from '../../infra/http/services/videos.service';
import { CreateVideoUseCase } from '../use-cases/create-video.use-case';

export const makeCreateVideoUseCase = () => {
  const prisma = new PrismaService();
  const videosService = new VideosService(prisma);
  return new CreateVideoUseCase(videosService);
};
