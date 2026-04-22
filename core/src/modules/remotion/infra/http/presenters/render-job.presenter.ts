import { RenderJob } from '../../../domain/entities/render-job.entity';

export class RenderJobPresenter {
  static toHttp(job: RenderJob) {
    return {
      id: job.id,
      userId: job.userId,
      videoId: job.videoId,
      templateId: job.templateId,
      status: job.status,
      error: job.error,
      resultKey: job.resultKey,
      resultUrl: job.resultUrl,
      completedAt: job.completedAt,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
