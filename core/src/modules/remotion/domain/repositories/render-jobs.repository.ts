import { AsyncMaybe } from '../../../../shared/core/domain/logic/maybe';
import { RenderJob, RenderJobStatus } from '../entities/render-job.entity';
import { RemotionTemplateId } from '../constants/remotion-template.constants';

export abstract class RenderJobsRepository {
  abstract create(job: RenderJob): Promise<RenderJob>;
  abstract findById(userId: string, jobId: string): AsyncMaybe<RenderJob>;
  abstract markRunning(jobId: string): Promise<RenderJob>;
  abstract markSucceeded(
    jobId: string,
    result: {
      resultKey: string;
      resultUrl: string;
      templateId?: RemotionTemplateId;
    },
  ): Promise<RenderJob>;
  abstract markFailed(jobId: string, error: string): Promise<RenderJob>;
  abstract updateStatus(jobId: string, status: RenderJobStatus): Promise<RenderJob>;
}
