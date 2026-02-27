import { env } from '../../../../shared/config/env';
import { AiRepository } from '../../domain/repositories/ai.repository';
import { GenerateQuizInput, GenerateQuizOutput } from '../../domain/types/types';

export class GenerateQuizUseCase {
  constructor(private readonly repository: AiRepository) {}

  async execute(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
    const result = env.NODE_ENV === "production"
      ? await this.repository.generateQuizOpenAi(input)
      : await this.repository.generateQuiz(input);

    return result;
  }
}
