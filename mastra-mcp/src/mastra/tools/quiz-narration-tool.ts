import { createTool } from '@mastra/core/tools';
import { api, getAxiosErrorMessage } from '../../shared/lib/core-api';
import { logAndReportError } from '../../shared/lib/discord-error';
import {
  type GeneratedQuiz,
  generatedQuizSchema,
  type NarratedQuiz,
  quizWorkflowOutputSchema,
} from '../schemas/quiz-workflow-schemas';

export const generateQuizNarration = async (
  data: GeneratedQuiz,
): Promise<NarratedQuiz> => {
  try {
    const response = await api.post('/ai/quiz/narration', data);

    return response.data;
  } catch (err) {
    logAndReportError('[mastra-mcp][generateQuizNarration] error:', err);
    const message = getAxiosErrorMessage(err);
    throw new Error(`Failed to generate quiz narration via Core: ${message}`);
  }
};

export const quizNarrationTool = createTool({
  id: 'generate-quiz-narration',
  description: 'Generate spoken narration audio for all quiz questions via Core API',
  inputSchema: generatedQuizSchema,
  outputSchema: quizWorkflowOutputSchema,
  execute: async (inputData) => {
    return await generateQuizNarration(inputData);
  }
});
