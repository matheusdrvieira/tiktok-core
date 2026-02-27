import OpenAI from 'openai';
import { env } from '../../../../../shared/config/env';
import { GenerateNarrationInput, GenerateNarrationOutput, GenerateQuizInput, GenerateQuizOutput } from '../../../domain/types/types';
import { quizResponseSchema } from '../../../schemas/quiz.schemas';
import { buildQuizPrompt, mapQuestionsToDomain } from '../../../utils/quiz.utils';

export class AiOpenAiService {
  private readonly openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  async generateQuiz(props: GenerateQuizInput): Promise<GenerateQuizOutput> {
    const maxAttempts = 3;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const [systemMessage, userMessage] = buildQuizPrompt(props);

        const response = await this.openai.responses.create({
          model: 'gpt-4o-mini',
          instructions: systemMessage?.content ?? '',
          input: userMessage?.content ?? '',
          text: {
            format: {
              type: 'json_object',
            },
          },
        });

        return this.toQuizOutput(response.output_text);

      } catch (err) {
        lastError = err;
      }
    }

    const message = lastError instanceof Error
      ? lastError.message
      : 'Falha ao gerar quiz com OpenAI.';
    throw new Error(message);
  }

  async generateNarration(input: GenerateNarrationInput): Promise<GenerateNarrationOutput> {
    try {
      const speech = await this.openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'onyx',
        input: input.text,
        instructions: `Leia em português do Brasil, com energia e entusiasmo de apresentador de quiz. Mantenha dicção clara, ritmo natural levemente acelerado e entonação animada.`,
        speed: 1.1,
        response_format: 'mp3',
      });

      return { audioBuffer: Buffer.from(await speech.arrayBuffer()) };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Failed to generate narration: ${message}`);
    }
  }

  private toQuizOutput(content: string): GenerateQuizOutput {
    const { questions, title, hashtags, category, description } = quizResponseSchema.parse(
      JSON.parse(content),
    );

    if (!questions.length) {
      throw new Error('A IA não retornou conteúdo para o quiz.');
    }

    return {
      title,
      hashtags,
      category,
      description,
      questions: mapQuestionsToDomain(questions),
    };
  }
}
