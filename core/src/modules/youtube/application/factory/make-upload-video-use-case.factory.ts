import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../../integrations/infra/http/services/integrations.service';
import { VideosService } from '../../../videos/infra/http/services/videos.service';
import { YoutubeService } from '../../infra/http/services/youtube.service';
import { UploadVideoUseCase } from '../use-cases/upload-video.use-case';

export const makeUploadVideoUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  const videosService = new VideosService(prisma);
  const youtubeService = new YoutubeService();

  return new UploadVideoUseCase(youtubeService, integrationsService, videosService);
};
