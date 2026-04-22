import { PrismaService } from '../../../../shared/database/prisma.service';
import { RenderJobsService } from '../../infra/http/services/render-jobs.service';
import { RunRenderVideoJobUseCase } from '../use-cases/run-render-video-job.use-case';
import { makeRenderVideoUseCase } from './make-render-video-use-case.factory';

export const makeRunRenderVideoJobUseCase = () => {
  const prisma = new PrismaService();
  const renderJobsService = new RenderJobsService(prisma);
  const renderVideoUseCase = makeRenderVideoUseCase();

  return new RunRenderVideoJobUseCase(renderJobsService, renderVideoUseCase);
};
