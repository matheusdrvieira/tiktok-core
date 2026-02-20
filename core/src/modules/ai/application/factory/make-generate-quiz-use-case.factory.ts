import { AiService } from '../../infra/http/services/ai.service';
import { GenerateQuizUseCase } from '../use-cases/generate-quiz.use-case';

export const makeGenerateQuizUseCase = () => {
  const aiService = new AiService();
  return new GenerateQuizUseCase(aiService);
};
