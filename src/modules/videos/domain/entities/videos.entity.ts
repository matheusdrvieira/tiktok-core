import { Entity } from '../../../../shared/core/domain/entity';

export type VideoProps = {
  id?: string;
  userId: string;
  url: string;
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
