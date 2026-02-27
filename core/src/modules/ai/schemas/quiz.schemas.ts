import { z } from 'zod';

export const quizCategoryOptions = [
  { id: 1, label: 'Film & Animation' },
  { id: 2, label: 'Autos & Vehicles' },
  { id: 10, label: 'Music' },
  { id: 15, label: 'Pets & Animals' },
  { id: 17, label: 'Sports' },
  { id: 18, label: 'Short Movies' },
  { id: 19, label: 'Travel & Events' },
  { id: 20, label: 'Gaming' },
  { id: 21, label: 'Videoblogging' },
  { id: 22, label: 'People & Blogs' },
  { id: 23, label: 'Comedy' },
  { id: 24, label: 'Entertainment' },
  { id: 25, label: 'News & Politics' },
  { id: 26, label: 'Howto & Style' },
  { id: 27, label: 'Education' },
  { id: 28, label: 'Science & Technology' },
  { id: 29, label: 'Nonprofits & Activism' },
] as const;

export const quizQuestionSchema = z
  .object({
    question: z.string().min(1),
    answers: z.array(z.string().min(1)).length(4),
    correctAnswerIndex: z.number().int().min(0).max(3),
  });

export const quizResponseSchema = z.object({
  title: z.string().min(5).max(70),
  hashtags: z
    .string()
    .min(1)
    .refine((v) => {
      const parts = v.trim().split(/\s+/);
      if (parts.length < 3 || parts.length > 6) return false;
      return parts.every((p) => p.startsWith('#') && !p.includes('# ') && p.length > 1);
    }, 'hashtags devem ser 3..6, separadas por espaço, somente hashtags'),
  category: z.number().int().min(1).max(29),
  description: z.string().min(10).max(220),
  questions: z
    .array(
      z.object({
        question: z.string().min(8).max(140),
        answers: z.array(z.string().min(1).max(60)).length(4),
        correctAnswerIndex: z.number().int().min(0).max(3),
      }),
    )
    .min(1),
});

export const quizResponseJsonSchema = z.toJSONSchema(quizResponseSchema);
