import { Quiz } from '../../domain/entities/quizzes.entity';
import { QuizzesRepository } from '../../domain/repositories/quizzes.repository';
import { AsyncMaybe } from '../../../../shared/core/domain/logic/maybe';

export class UpdateQuizUseCase {
  constructor(private readonly repository: QuizzesRepository) {}

  async execute(userId: string, quizId: string, quiz: Quiz): AsyncMaybe<Quiz> {
    return await this.repository.update(userId, quizId, quiz);
  }
}
