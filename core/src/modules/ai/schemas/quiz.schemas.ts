import { z } from 'zod';

export const quizQuestionSchema = z
  .object({
    question: z.string().min(1),
    answers: z.array(z.string().min(1)).length(4),
    correctAnswer: z.string().min(1),
  })
  .refine((data) => data.answers.includes(data.correctAnswer), {
    message: 'correctAnswer precisa existir dentro de answers',
    path: ['correctAnswer'],
  });

export const videoTitleSchema = z
  .string()
  .min(1)
  .max(140)
  .refine((value) => {
    const lines = value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length !== 2) return false;

    const [titleLine, hashtagsLine] = lines;
    const hashtags = hashtagsLine.match(/#[^\s#]+/g) ?? [];
    const nonHashtagContent = hashtagsLine.replace(/#[^\s#]+/g, '').trim();

    return (
      titleLine.length <= 70
      && hashtags.length >= 2
      && hashtags.length <= 5
      && nonHashtagContent.length === 0
    );
  }, 'title deve ter 2 linhas: título curto e hashtags abaixo');

export const quizResponseSchema = z.object({
  title: videoTitleSchema,
  questions: z.array(quizQuestionSchema),
});

export const quizResponseJsonSchema = z.toJSONSchema(quizResponseSchema);
