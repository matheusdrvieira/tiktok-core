import { randomUUID } from 'node:crypto';
import ollama from 'ollama';
import OpenAI from 'openai';
import { env } from '../../../../../shared/config/env';
import { ttsApi } from '../../../../../shared/lib/http-client';
import { AiRepository } from '../../../domain/repositories/ai.repository';
import { GenerateNarrationInput, GenerateNarrationOutput, GenerateQuizInput, GenerateQuizOutput } from '../../../domain/types/types';
import { quizResponseJsonSchema, quizResponseSchema } from '../../../schemas/quiz.schemas';

export class AiService extends AiRepository {
  private readonly openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  async generateQuiz(props: GenerateQuizInput): Promise<GenerateQuizOutput> {
    try {
      const response = await ollama.chat({
        model: 'gpt-oss:20b',
        messages: this.quizPrompt(props),
        format: quizResponseJsonSchema
      })
      const { questions, title } = quizResponseSchema.parse(JSON.parse(response.message.content))

      if (!questions.length) {
        throw new Error("A IA não retornou conteúdo para o quiz.");
      }

      return {
        title,
        questions: this.toDomain(questions),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha ao gerar quiz com IA.";
      throw new Error(message);
    }
  }

  async generateNarration(input: GenerateNarrationInput): Promise<GenerateNarrationOutput> {
    try {
      const response = await ttsApi.post('/v1/audio/speech', {
        model: "kokoro",
        input: input.text,
        voice: "pm_alex",
        response_format: "mp3",
        download_format: "mp3",
        speed: 1,
        stream: true,
        return_download_link: false,
        lang_code: "p",
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
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Failed to generate narration: ${message}`);
    }
  }

  async generateQuizOpenAi(
    props: GenerateQuizInput,
  ): Promise<GenerateQuizOutput> {
    const [systemMessage, userMessage] = this.quizPrompt(props);

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

    const content = response.output_text;

    if (!content) {
      throw new Error("A OpenAI não retornou conteúdo para o quiz.");
    }

    const { questions, title } = quizResponseSchema.parse(JSON.parse(content));

    if (!questions.length) {
      throw new Error("A OpenAI não retornou conteúdo para o quiz.");
    }

    return {
      title,
      questions: this.toDomain(questions),
    };
  }

  async generateNarrationOpenAi(
    input: GenerateNarrationInput,
  ): Promise<GenerateNarrationOutput> {
    return await this.openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: 'onyx',
      input: input.text,
      response_format: 'mp3',
    }).then(async data => {
      console.log(data)
      return {
        audioBuffer: Buffer.from(await data.arrayBuffer())
      }
    }).catch(err => console.log(err) as any);
  }

  private quizPrompt(props: GenerateQuizInput) {
    return [
      {
        role: "system" as const,
        content:
          "Você gera quizzes em PT-BR. Responda SOMENTE com JSON válido e exatamente no schema solicitado. Sem markdown, sem texto extra.",
      },
      {
        role: "user" as const,
        content: [
          `Crie exatamente ${props.questionsCount} questões de múltipla escolha.`,
          `Nicho selecionado automaticamente: ${props.niche}.`,
          `Referência selecionada automaticamente: ${props.reference}.`,
          "Formato de saída JSON obrigatório:",
          '{"title":"string","questions":[{"question":"string","answers":["string","string","string","string"],"correctAnswer":"string"}]}',
          "Regras obrigatórias:",
          `1) Exatamente ${props.questionsCount} perguntas no array questions, todas sobre "${props.reference}".`,
          "2) Cada pergunta deve ter 4 alternativas no campo answers.",
          "3) Deve existir apenas 1 resposta correta por pergunta.",
          "4) correctAnswer deve ser exatamente uma das alternativas do campo answers.",
          `5) O campo "title" é obrigatório e deve estar relacionado a "${props.reference}".`,
          '6) Formato EXATO do "title" (string com duas linhas separadas por \\n):',
          "   - Linha 1: título curto (máximo 70 caracteres), sem hashtags.",
          "   - Linha 2: somente hashtags (mínimo 2 e máximo 5), sem texto extra.",
          "   - Hashtags separadas por espaço: #naruto #quiz #foryou.",
          '7) Exemplo válido de "title": "Super Onze: desafio final\\n#superonze #quiz #anime".',
          '8) Exemplo inválido de "title": "Super Onze #quiz" (faltou segunda linha só de hashtags).',
          "9) Não misture com outras referências, franquias, personagens ou universos.",
          "10) Não envie markdown, não envie texto fora do JSON.",
        ].join("\n"),
      },
    ];
  }

  private toDomain(
    questions: Array<{
      question: string;
      answers: string[];
      correctAnswer: string;
    }>,
  ): GenerateQuizOutput['questions'] {
    return questions.map((q) => {
      const questionId = randomUUID();

      const options = q.answers.map((text) => ({
        id: randomUUID(),
        text: String(text).trim(),
      }));

      if (options.length !== 4) {
        throw new Error(`Pergunta inválida: opções != 4. Pergunta: "${q.question}"`);
      }

      const correctText = String(q.correctAnswer).trim();
      const correctOption = options.find((o) => o.text === correctText);

      if (!correctOption) {
        throw new Error(
          `Resposta correta não bate com nenhuma alternativa. Pergunta: "${q.question}"`,
        );
      }

      return {
        id: questionId,
        question: String(q.question).trim(),
        options,
        answer: {
          correctOptionId: correctOption.id,
        },
      };
    });
  }
}
