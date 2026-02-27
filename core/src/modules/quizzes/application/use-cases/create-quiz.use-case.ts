import { Quiz } from '../../domain/entities/quizzes.entity';
import { QuizzesRepository } from '../../domain/repositories/quizzes.repository';

export class CreateQuizUseCase {
  constructor(private readonly repository: QuizzesRepository) {}

  async execute(quiz: Quiz): Promise<Quiz> {
    return await this.repository.create(quiz);
  }
}
