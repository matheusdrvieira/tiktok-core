import { GenerateNarrationInput, GenerateNarrationOutput, GenerateQuizInput, GenerateQuizOutput } from '../types/types';

export abstract class AiRepository {
  abstract generateQuiz(props: GenerateQuizInput): Promise<GenerateQuizOutput>;
  abstract generateNarration(input: GenerateNarrationInput): Promise<GenerateNarrationOutput>;
  abstract generateQuizOpenAi(props: GenerateQuizInput): Promise<GenerateQuizOutput>;
  abstract generateNarrationOpenAi(input: GenerateNarrationInput): Promise<GenerateNarrationOutput>;
}
