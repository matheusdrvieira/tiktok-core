import { Entity } from '../../../../shared/core/domain/entity';

export enum VideoStatus {
  DRAFT = 'DRAFT',
  RENDERED = 'RENDERED',
  PUBLISHED = 'PUBLISHED',
}

export type VideoProps = {
  id?: string;
  userId: string;
  title: string;
  hashtags: string[];
  description: string;
  category: string;
  url?: string;
  size?: number;
  duration?: number;
  status: VideoStatus;
  quizId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Video extends Entity<VideoProps> {
  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get url() {
    return this.props.url;
  }

  get title() {
    return this.props.title;
  }

  get hashtags() {
    return this.props.hashtags;
  }

  get description() {
    return this.props.description;
  }

  get category() {
    return this.props.category;
  }

  get quizId() {
    return this.props.quizId;
  }

  get size() {
    return this.props.size;
  }

  get duration() {
    return this.props.duration;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: VideoProps): Video {
    return new Video(props);
  }
}
