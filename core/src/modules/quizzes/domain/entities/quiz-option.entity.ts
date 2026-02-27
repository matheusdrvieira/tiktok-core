import { Entity } from '../../../../shared/core/domain/entity';

export type QuizOptionProps = {
  id: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class QuizOption extends Entity<QuizOptionProps> {
  get id() {
    return this.props.id;
  }

  get text() {
    return this.props.text;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuizOptionProps): QuizOption {
    return new QuizOption(props);
  }
}
