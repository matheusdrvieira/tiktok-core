import { z } from 'zod';

export const quizNarrationInputSchema = z.object({
  id: z.string().trim().min(1),
  input: z.string().trim().min(1),
});

export const quizNarrationOutputSchema = z.object({
  url: z.string().min(1),
});

export type QuizNarrationInput = z.infer<typeof quizNarrationInputSchema>;
export type QuizNarrationOutput = z.infer<typeof quizNarrationOutputSchema>;
