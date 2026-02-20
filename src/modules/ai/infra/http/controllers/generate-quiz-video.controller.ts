import { Elysia } from 'elysia';
import { env } from '../../../../../shared/config/env';
import { getAxiosErrorMessage, mcpApi } from '../../../../../shared/lib/http-client';

export const generateQuizVideoController = new Elysia().post(
  '/ai/quiz/video',
  async ({ set }) => {
    try {
      const { data } = await mcpApi.post('/quiz/video', {});
      return {
        ...data,
        questions: data.questions.map((question: any) => ({
          ...question,
          questionPath: `${env.BACKEND_URL}/bucket/audio?key=${encodeURIComponent(question.questionPath)}`,
          answerCorrectPath: `${env.BACKEND_URL}/bucket/audio?key=${encodeURIComponent(question.answerCorrectPath)}`,
        })),
      };
    } catch (err) {
      set.status = 502;
      return {
        message: `Failed to generate quiz video via MCP: ${getAxiosErrorMessage(err)}`,
      };
    }
  },
);
