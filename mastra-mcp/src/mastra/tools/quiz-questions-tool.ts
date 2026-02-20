import { createTool } from '@mastra/core/tools';
import { api, getAxiosErrorMessage } from '../../shared/lib/core-api';
import { quizQuestionsOutputSchema } from '../schemas/quiz-question-schema';

export const generateQuizQuestions = async () => {
  try {
    const response = await api.post('/ai/quiz/generate');
    return response.data;
  } catch (err) {
    throw new Error(`Failed to generate quiz via Core: ${getAxiosErrorMessage(err)}`);
  }
};

export const quizQuestionsTool = createTool({
  id: 'generate-quiz-questions',
  description: 'Generate multiple choice quiz questions via Core API',
  outputSchema: quizQuestionsOutputSchema,
  execute: async () => {
    return await generateQuizQuestions();
  },
});
