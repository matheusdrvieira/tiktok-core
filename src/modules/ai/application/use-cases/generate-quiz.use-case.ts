import { env } from '../../../../shared/config/env';
import { AiRepository } from '../../domain/repositories/ai.repository';
import { GenerateQuizInput, GenerateQuizOutput } from '../../domain/types/types';

const QUIZ_NICHE = 'anime';
const QUIZ_REFERENCES = ['naruto', 'dragon ball', 'super onze'];
const DEFAULT_QUIZ_QUESTIONS_COUNT = 10;

const getRandomReference = (): string => {
  const randomIndex = Math.floor(Math.random() * QUIZ_REFERENCES.length);
  const reference = QUIZ_REFERENCES[randomIndex];

  if (!reference) {
    throw new Error('Não foi possível selecionar referência aleatória.');
  }

  return reference;
};

export class GenerateQuizUseCase {
  constructor(private readonly repository: AiRepository) { }

  async execute(): Promise<GenerateQuizOutput> {
    const input: GenerateQuizInput = {
      niche: QUIZ_NICHE,
      reference: getRandomReference(),
      questionsCount: DEFAULT_QUIZ_QUESTIONS_COUNT,
    };

    return env.NODE_ENV === "production"
      ? await this.repository.generateQuizOpenAi(input)
      : await this.repository.generateQuiz(input);
  }
}
