import { AiRepository } from '../../../domain/repositories/ai.repository';
import { GenerateNarrationInput, GenerateNarrationOutput, GenerateQuizInput, GenerateQuizOutput } from '../../../domain/types/types';
import { AiLocalService } from './ai-local.service';
import { AiOpenAiService } from './ai-openai.service';

export class AiService extends AiRepository {
  private readonly localService = new AiLocalService();
  private readonly openAiService = new AiOpenAiService();

  async generateQuiz(props: GenerateQuizInput): Promise<GenerateQuizOutput> {
    return this.localService.generateQuiz(props);
  }

  async generateNarration(input: GenerateNarrationInput): Promise<GenerateNarrationOutput> {
    return this.localService.generateNarration(input);
  }

  async generateQuizOpenAi(props: GenerateQuizInput,): Promise<GenerateQuizOutput> {
    return this.openAiService.generateQuiz(props);
  }

  async generateNarrationOpenAi(input: GenerateNarrationInput,): Promise<GenerateNarrationOutput> {
    return this.openAiService.generateNarration(input);
  }
}
