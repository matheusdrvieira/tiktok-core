import { Entity } from '../../../../shared/core/domain/entity';
import { QuizOption } from './quiz-option.entity';

export type QuizQuestionProps = {
  id: string;
  question: string;
  correctAnswerIndex: number;
  questionPath?: string;
  answerCorrectPath?: string;
  options: QuizOption[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class QuizQuestion extends Entity<QuizQuestionProps> {
  get id() {
    return this.props.id;
  }

  get question() {
    return this.props.question;
  }

  get correctAnswerIndex() {
    return this.props.correctAnswerIndex;
  }

  get questionPath() {
    return this.props.questionPath;
  }

  get answerCorrectPath() {
    return this.props.answerCorrectPath;
  }

  get options() {
    return this.props.options;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuizQuestionProps): QuizQuestion {
    return new QuizQuestion(props);
  }
}
