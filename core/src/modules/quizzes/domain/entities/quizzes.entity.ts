import { Entity } from '../../../../shared/core/domain/entity';
import { QuizQuestion } from './quiz-question.entity';
import { QuizVideo } from './quiz-video.entity';

export type QuizProps = {
  id?: string;
  userId: string;
  questions: QuizQuestion[];
  videos?: QuizVideo[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class Quiz extends Entity<QuizProps> {
  get id() {
    return this.props.id;
  }

  get questions() {
    return this.props.questions;
  }

  get userId() {
    return this.props.userId;
  }

  get videos() {
    return this.props.videos ?? [];
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuizProps): Quiz {
    return new Quiz({
      ...props,
      videos: props.videos ?? [],
    });
  }
}
