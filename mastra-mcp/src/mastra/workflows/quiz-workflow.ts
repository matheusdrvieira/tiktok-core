import { createStep, createWorkflow } from '@mastra/core/workflows';
import {
  type GeneratedQuiz,
  generatedQuizSchema,
  quizWorkflowInputSchema,
  quizWorkflowOutputSchema,
} from '../schemas/quiz-workflow-schemas';
import { generateQuizNarration } from '../tools/quiz-narration-tool';
import { generateQuizQuestions } from '../tools/quiz-questions-tool';

const generateQuizQuestionsStep = createStep({
  id: 'generate-quiz-questions-step',
  description: 'Gerar título do quiz e perguntas de múltipla escolha',
  inputSchema: quizWorkflowInputSchema,
  outputSchema: generatedQuizSchema,
  execute: async () => {
    return await generateQuizQuestions();
  },
});

const generateQuizNarrationStep = createStep({
  id: "generate-quiz-narration-step",
  description: "Gerar áudios narrados do quiz",
  inputSchema: generatedQuizSchema,
  outputSchema: quizWorkflowOutputSchema,
  execute: async ({ inputData }: { inputData: GeneratedQuiz }) => {
    if (!inputData) throw new Error("Quiz content not found.");
    return await generateQuizNarration(inputData);
  },
});

const quizWorkflow = createWorkflow({
  id: 'quiz-workflow',
  inputSchema: quizWorkflowInputSchema,
  outputSchema: quizWorkflowOutputSchema,
})
  .then(generateQuizQuestionsStep)
  .then(generateQuizNarrationStep);

quizWorkflow.commit();

export { quizWorkflow };
