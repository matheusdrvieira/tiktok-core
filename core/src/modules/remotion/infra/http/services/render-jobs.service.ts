import { PrismaService } from '../../../../../shared/database/prisma.service';
import {
  RenderJob,
  RenderJobStatus,
} from '../../../domain/entities/render-job.entity';
import { RenderJobsRepository } from '../../../domain/repositories/render-jobs.repository';
import { RemotionTemplateId } from '../../../domain/constants/remotion-template.constants';

type RenderJobRecord = {
  id: string;
  userId: string;
  videoId: string;
  templateId: string | null;
  status: string;
  error: string | null;
  resultKey: string | null;
  resultUrl: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class RenderJobsService implements RenderJobsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(job: RenderJob): Promise<RenderJob> {
    const createdJob = await this.prisma.renderJobs.create({
      data: {
        userId: job.userId,
        videoId: job.videoId,
        templateId: job.templateId,
        status: job.status,
      },
    });

    return this.toDomain(createdJob);
  }

  async findById(userId: string, jobId: string): Promise<RenderJob | null> {
    const job = await this.prisma.renderJobs.findFirst({
      where: {
        id: jobId,
        userId,
      },
    });

    return job ? this.toDomain(job) : null;
  }

  async markRunning(jobId: string): Promise<RenderJob> {
    return this.updateStatus(jobId, RenderJobStatus.RUNNING);
  }

  async markSucceeded(
    jobId: string,
    result: {
      resultKey: string;
      resultUrl: string;
      templateId?: RemotionTemplateId;
    },
  ): Promise<RenderJob> {
    const updatedJob = await this.prisma.renderJobs.update({
      where: {
        id: jobId,
      },
      data: {
        status: RenderJobStatus.SUCCEEDED,
        templateId: result.templateId,
        resultKey: result.resultKey,
        resultUrl: result.resultUrl,
        completedAt: new Date(),
      },
    });

    return this.toDomain(updatedJob);
  }

  async markFailed(jobId: string, error: string): Promise<RenderJob> {
    const updatedJob = await this.prisma.renderJobs.update({
      where: {
        id: jobId,
      },
      data: {
        status: RenderJobStatus.FAILED,
        error,
        completedAt: new Date(),
      },
    });

    return this.toDomain(updatedJob);
  }

  async updateStatus(jobId: string, status: RenderJobStatus): Promise<RenderJob> {
    const updatedJob = await this.prisma.renderJobs.update({
      where: {
        id: jobId,
      },
      data: {
        status,
      },
    });

    return this.toDomain(updatedJob);
  }

  private toDomain(job: RenderJobRecord): RenderJob {
    return RenderJob.create({
      id: job.id,
      userId: job.userId,
      videoId: job.videoId,
      templateId: (job.templateId ?? undefined) as RemotionTemplateId | undefined,
      status: RenderJobStatus[job.status as keyof typeof RenderJobStatus],
      error: job.error ?? undefined,
      resultKey: job.resultKey ?? undefined,
      resultUrl: job.resultUrl ?? undefined,
      completedAt: job.completedAt ?? undefined,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  }
}
