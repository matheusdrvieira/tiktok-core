import { Quiz } from '../../domain/entities/quizzes.entity';
import { QuizzesRepository } from '../../domain/repositories/quizzes.repository';

export class ListQuizzesUseCase {
  constructor(private readonly repository: QuizzesRepository) {}

  async execute(userId: string): Promise<Quiz[]> {
    return await this.repository.list(userId);
  }
}
