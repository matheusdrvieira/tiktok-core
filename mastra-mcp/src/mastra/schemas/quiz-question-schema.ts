import { z } from 'zod';

export const quizQuestionSchema = z
  .object({
    id: z.string().trim().min(1),
    question: z.string().trim().min(1),
    options: z
      .array(
        z.object({
          id: z.string().trim().min(1),
          text: z.string().trim().min(1),
        })
      )
      .length(4),
    answer: z.object({
      correctAnswerIndex: z.number().int().min(0).max(3),
    }),
  })
  .refine(
    (item: {
      options: Array<{ id: string }>;
      answer: { correctAnswerIndex: number };
    }) => item.answer.correctAnswerIndex >= 0 && item.answer.correctAnswerIndex < item.options.length,
    {
      message: "correctAnswerIndex must point to an option index",
      path: ["answer", "correctAnswerIndex"],
    }
  );


export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const quizQuestionsOutputSchema = z.object({
  title: z.string().trim().min(1),
  hashtags: z.string().trim().min(1),
  category: z.number().int().positive(),
  description: z.string().trim().min(1),
  questions: z.array(quizQuestionSchema),
});

export type QuizQuestionsOutput = z.infer<typeof quizQuestionsOutputSchema>;
