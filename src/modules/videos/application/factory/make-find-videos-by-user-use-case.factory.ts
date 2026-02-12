import { PrismaService } from '../../../../shared/database/prisma.service';
import { VideosService } from '../../infra/http/services/videos.service';
import { FindVideosByUserUseCase } from '../use-cases/find-videos-by-user.use-case';

export const makeFindVideosByUserUseCase = () => {
  const prisma = new PrismaService();
  const videosService = new VideosService(prisma);
  return new FindVideosByUserUseCase(videosService);
};
