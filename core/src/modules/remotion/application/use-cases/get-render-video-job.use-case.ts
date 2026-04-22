import { AsyncMaybe } from '../../../../shared/core/domain/logic/maybe';
import { RenderJob } from '../../domain/entities/render-job.entity';
import { RenderJobsRepository } from '../../domain/repositories/render-jobs.repository';

export class GetRenderVideoJobUseCase {
  constructor(private readonly renderJobsRepository: RenderJobsRepository) { }

  async execute(userId: string, jobId: string): AsyncMaybe<RenderJob> {
    return await this.renderJobsRepository.findById(userId, jobId);
  }
}
