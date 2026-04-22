import {
  RenderJob,
  RenderJobStatus,
} from '../../domain/entities/render-job.entity';
import { RenderJobsRepository } from '../../domain/repositories/render-jobs.repository';
import { RenderVideoRequest } from '../../domain/types/types';
import { RunRenderVideoJobUseCase } from './run-render-video-job.use-case';

export class StartRenderVideoJobUseCase {
  constructor(
    private readonly renderJobsRepository: RenderJobsRepository,
    private readonly runRenderVideoJobUseCase: RunRenderVideoJobUseCase,
  ) { }

  async execute(props: RenderVideoRequest): Promise<RenderJob> {
    const job = await this.renderJobsRepository.create(
      RenderJob.create({
        userId: props.userId,
        videoId: props.videoId,
        templateId: props.templateId,
        status: RenderJobStatus.QUEUED,
      }),
    );

    if (!job.id) {
      throw new Error('Render job created without id.');
    }

    void this.runRenderVideoJobUseCase.execute(job.id, props);

    return job;
  }
}
