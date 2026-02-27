import { Entity } from '../../../../shared/core/domain/entity';

export type QuizVideoProps = {
  id?: string;
  userId: string;
  title: string;
  hashtags: string[];
  description: string;
  category: string;
  url?: string;
  size?: number;
  duration?: number;
  status: string;
  quizId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class QuizVideo extends Entity<QuizVideoProps> {
  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
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

  get url() {
    return this.props.url;
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

  get quizId() {
    return this.props.quizId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuizVideoProps): QuizVideo {
    return new QuizVideo(props);
  }
}
