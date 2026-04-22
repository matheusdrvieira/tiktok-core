import { Entity } from '../../../../shared/core/domain/entity';
import { RemotionTemplateId } from '../constants/remotion-template.constants';

export enum RenderJobStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export type RenderJobProps = {
  id?: string;
  userId: string;
  videoId: string;
  templateId?: RemotionTemplateId;
  status: RenderJobStatus;
  error?: string;
  resultKey?: string;
  resultUrl?: string;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class RenderJob extends Entity<RenderJobProps> {
  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get videoId() {
    return this.props.videoId;
  }

  get templateId() {
    return this.props.templateId;
  }

  get status() {
    return this.props.status;
  }

  get error() {
    return this.props.error;
  }

  get resultKey() {
    return this.props.resultKey;
  }

  get resultUrl() {
    return this.props.resultUrl;
  }

  get completedAt() {
    return this.props.completedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: RenderJobProps): RenderJob {
    return new RenderJob(props);
  }
}
