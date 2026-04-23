import ollama from 'ollama';
import { logAndReportError } from '../../../../../shared/lib/discord-error';
import { ttsApi } from '../../../../../shared/lib/http-client';
import { GenerateNarrationInput, GenerateNarrationOutput, GenerateQuizInput, GenerateQuizOutput } from '../../../domain/types/types';
import { quizResponseSchema } from '../../../schemas/quiz.schemas';
import { buildQuizPrompt, mapQuestionsToDomain } from '../../../utils/quiz.utils';

export class AiLocalService {
  async generateQuiz(props: GenerateQuizInput): Promise<GenerateQuizOutput> {
    const maxAttempts = 3;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const response = await ollama.chat({
          model: 'gpt-oss:20b',
          messages: buildQuizPrompt(props),
          format: 'json',
          stream: false,
        });

        return this.toQuizOutput(response.message.content);
      } catch (err) {
        if (attempt === maxAttempts) {
          logAndReportError(`[ai-local][generateQuiz] attempt ${attempt} failed:`, err);
        } else {
          console.error(`[ai-local][generateQuiz] attempt ${attempt} failed:`, err);
        }
        lastError = err;
      }
    }

    const message = lastError instanceof Error ? lastError.message : 'Falha ao gerar quiz com IA.';
    throw new Error(message);
  }

  async generateNarration(input: GenerateNarrationInput): Promise<GenerateNarrationOutput> {
    try {
      const response = await ttsApi.post('/v1/audio/speech', {
        model: 'kokoro',
        input: input.text,
        voice: 'pm_alex',
        response_format: 'mp3',
        download_format: 'mp3',
        speed: 1,
        stream: true,
        return_download_link: false,
        lang_code: 'p',
        volume_multiplier: 1,
        normalization_options: {
          normalize: true,
          unit_normalization: false,
          url_normalization: true,
          email_normalization: true,
          optional_pluralization_normalization: true,
          phone_normalization: true,
          replace_remaining_symbols: true,
        },
      });

      return { audioBuffer: response.data };
    } catch (err) {
      logAndReportError('[ai-local][generateNarration] error:', err);
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
