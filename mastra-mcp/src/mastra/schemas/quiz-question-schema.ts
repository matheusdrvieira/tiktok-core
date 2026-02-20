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
      correctOptionId: z.string().trim().min(1),
    }),
  })
  .refine(
    (item: {
      options: Array<{ id: string }>;
      answer: { correctOptionId: string };
    }) => item.options.some((o) => o.id === item.answer.correctOptionId),
    {
      message: "correctOptionId must exist in options",
      path: ["answer", "correctOptionId"],
    }
  );


export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const quizQuestionsOutputSchema = z.object({
  title: z.string().trim().min(1),
  questions: z.array(quizQuestionSchema),
});

export type QuizQuestionsOutput = z.infer<typeof quizQuestionsOutputSchema>;
