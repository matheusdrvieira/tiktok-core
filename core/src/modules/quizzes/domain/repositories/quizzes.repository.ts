import { Quiz } from '../entities/quizzes.entity';
import { AsyncMaybe } from '../../../../shared/core/domain/logic/maybe';

export abstract class QuizzesRepository {
  abstract create(quiz: Quiz): Promise<Quiz>;
  abstract list(userId: string): Promise<Quiz[]>;
  abstract findById(userId: string, quizId: string): AsyncMaybe<Quiz>;
  abstract update(userId: string, quizId: string, quiz: Quiz): AsyncMaybe<Quiz>;
}
