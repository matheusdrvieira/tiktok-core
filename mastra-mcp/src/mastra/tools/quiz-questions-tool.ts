import { createTool } from '@mastra/core/tools';
import { api, getAxiosErrorMessage } from '../../shared/lib/core-api';
import { logAndReportError } from '../../shared/lib/discord-error';
import { quizQuestionsOutputSchema } from '../schemas/quiz-question-schema';
import { quizWorkflowInputSchema, type QuizWorkflowInput } from '../schemas/quiz-workflow-schemas';

export const generateQuizQuestions = async (
  input: QuizWorkflowInput,
) => {
  try {
    const response = await api.post('/ai/quiz/generate', input);
    return response.data;
  } catch (err) {
    logAndReportError('[mastra-mcp][generateQuizQuestions] error:', err);
    throw new Error(`Failed to generate quiz via Core: ${getAxiosErrorMessage(err)}`);
  }
};

export const quizQuestionsTool = createTool({
  id: 'generate-quiz-questions',
  description: 'Generate multiple choice quiz questions via Core API',
  inputSchema: quizWorkflowInputSchema,
  outputSchema: quizQuestionsOutputSchema,
  execute: async (inputData) => {
    return await generateQuizQuestions(inputData);
  },
});
