import { z } from 'zod';
import { quizNarrationOutputSchema } from './quiz-narration-schemas';
import { quizQuestionSchema } from './quiz-question-schema';

export const quizWorkflowInputSchema = z.object({
  niche: z.string().trim().min(1),
  reference: z.string().trim().min(1),
  questionsCount: z.number().int().min(4).max(10),
});

export type QuizWorkflowInput = z.infer<typeof quizWorkflowInputSchema>;

export const generatedQuizSchema = z.object({
  title: z.string().trim().min(1),
  hashtags: z.string().trim().min(1),
  category: z.number().int().positive(),
  description: z.string().trim().min(1),
  questions: z.array(quizQuestionSchema).min(4).max(10),
});

export type GeneratedQuizQuestion = z.infer<typeof generatedQuizSchema>;
export type GeneratedQuiz = z.infer<typeof generatedQuizSchema>;

export const narratedQuizQuestionSchema = quizQuestionSchema.extend({
  questionPath: quizNarrationOutputSchema.shape.url,
  answerCorrectPath: quizNarrationOutputSchema.shape.url,
});

export const quizWorkflowOutputSchema = z.object({
  title: z.string().trim().min(1),
  hashtags: z.string().trim().min(1),
  category: z.number().int().positive(),
  description: z.string().trim().min(1),
  questions: z.array(narratedQuizQuestionSchema).min(4).max(10),
});

export type NarratedQuizQuestion = z.infer<typeof narratedQuizQuestionSchema>;
export type NarratedQuiz = z.infer<typeof quizWorkflowOutputSchema>;
