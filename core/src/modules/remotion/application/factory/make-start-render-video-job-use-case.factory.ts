import { PrismaService } from '../../../../shared/database/prisma.service';
import { RenderJobsService } from '../../infra/http/services/render-jobs.service';
import { StartRenderVideoJobUseCase } from '../use-cases/start-render-video-job.use-case';
import { makeRunRenderVideoJobUseCase } from './make-run-render-video-job-use-case.factory';

export const makeStartRenderVideoJobUseCase = () => {
  const prisma = new PrismaService();
  const renderJobsService = new RenderJobsService(prisma);
  const runRenderVideoJobUseCase = makeRunRenderVideoJobUseCase();

  return new StartRenderVideoJobUseCase(
    renderJobsService,
    runRenderVideoJobUseCase,
  );
};
