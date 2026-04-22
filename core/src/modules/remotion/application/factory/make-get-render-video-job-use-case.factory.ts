import { PrismaService } from '../../../../shared/database/prisma.service';
import { RenderJobsService } from '../../infra/http/services/render-jobs.service';
import { GetRenderVideoJobUseCase } from '../use-cases/get-render-video-job.use-case';

export const makeGetRenderVideoJobUseCase = () => {
  const prisma = new PrismaService();
  const renderJobsService = new RenderJobsService(prisma);

  return new GetRenderVideoJobUseCase(renderJobsService);
};
