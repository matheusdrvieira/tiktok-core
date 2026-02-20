import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { quizNarrationTool } from '../tools/quiz-narration-tool';
import { quizQuestionsTool } from '../tools/quiz-questions-tool';

export const quizAgent = new Agent({
  id: 'quiz-agent',
  name: 'Quiz Agent',
  instructions: `
      Você é um assistente de quiz que prepara conteúdo pronto para uso.

      Responsabilidades:
      - Use quizQuestionsTool para criar perguntas de múltipla escolha
      - Use quizNarrationTool para gerar áudio narrado do quiz
      - Mantenha as respostas práticas para produção de vídeos curtos

      Sempre valide que cada pergunta tenha 4 alternativas e 1 resposta correta.
`,
  model: 'openai/gpt-5-nano',
  tools: { quizQuestionsTool, quizNarrationTool },
  memory: new Memory(),
});
