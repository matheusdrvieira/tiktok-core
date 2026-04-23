import { RenderJobsRepository } from '../../domain/repositories/render-jobs.repository';
import { RenderVideoRequest } from '../../domain/types/types';
import { RenderVideoUseCase } from './render-video.use-case';
import { logAndReportError } from '../../../../shared/lib/discord-error';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Falha desconhecida ao renderizar vídeo.';
};

export class RunRenderVideoJobUseCase {
  constructor(
    private readonly renderJobsRepository: RenderJobsRepository,
    private readonly renderVideoUseCase: RenderVideoUseCase,
  ) { }

  async execute(jobId: string, props: RenderVideoRequest): Promise<void> {
    try {
      await this.renderJobsRepository.markRunning(jobId);

      const rendered = await this.renderVideoUseCase.execute(props);

      await this.renderJobsRepository.markSucceeded(jobId, {
        resultKey: rendered.key,
        resultUrl: rendered.url,
        templateId: rendered.templateId,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      logAndReportError('[remotion][runRenderVideoJob] error:', error);

      try {
        await this.renderJobsRepository.markFailed(jobId, message);
      } catch (markFailedError) {
        logAndReportError(
          '[remotion][runRenderVideoJob][markFailed] error:',
          markFailedError,
        );
      }
    }
  }
}
