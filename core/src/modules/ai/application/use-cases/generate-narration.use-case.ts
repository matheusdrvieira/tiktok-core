import { env } from "../../../../shared/config/env";
import { UploadFileUseCase } from "../../../bucket/application/use-cases/upload-file.use-case";
import { AiRepository } from "../../domain/repositories/ai.repository";
import {
    GenerateQuizNarrationInput,
    GenerateQuizNarrationOutput,
    NarratedQuizQuestion,
} from "../../domain/types/types";

export class GenerateNarrationUseCase {
    constructor(
        private readonly aiRepository: AiRepository,
        private readonly uploadFileUseCase: UploadFileUseCase
    ) { }

    async execute(input: GenerateQuizNarrationInput): Promise<GenerateQuizNarrationOutput> {
        const questionsWithPaths: NarratedQuizQuestion[] = [];

        for (const [index, question] of input.questions.entries()) {
            const correctOption = question.options.find(
                (option) => option.id === question.answer.correctOptionId,
            );

            if (!correctOption) {
                throw new Error(`Correct option not found for question "${question.id}".`);
            }

            const questionPath = await this.generateAndUploadNarration({
                id: question.id,
                text: `Pergunta ${index + 1}: ${question.question}`,
            });

            const answerCorrectPath = await this.generateAndUploadNarration({
                id: correctOption.id,
                text: `Resposta correta: ${correctOption.text}`,
            });

            questionsWithPaths.push({
                ...question,
                questionPath,
                answerCorrectPath,
            });
        }

        return {
            title: input.title,
            questions: questionsWithPaths,
        };
    }

    private async generateAndUploadNarration(input: {
        id: string;
        text: string;
    }): Promise<string> {
        const { audioBuffer } = env.NODE_ENV === "production"
            ? await this.aiRepository.generateNarrationOpenAi({ text: input.text })
            : await this.aiRepository.generateNarration({ text: input.text });

        const key = `quiz/narrations/${input.id}.mp3`;

        await this.uploadFileUseCase.execute({
            key,
            body: audioBuffer,
        });

        return key;
    }
}
