import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { CloudExporter, DefaultExporter, Observability, SensitiveDataFilter } from '@mastra/observability';
import { PostgresStore } from '@mastra/pg';
import { env } from '../shared/config/env';
import { quizAgent } from './agents/quiz-agent';
import { quizWorkflow } from './workflows/quiz-workflow';

export const mastra = new Mastra({
  workflows: { quizWorkflow },
  agents: { quizAgent },
  storage: new PostgresStore({
    id: "mastra-storage",
    connectionString: env.DATABASE_URL,
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new DefaultExporter(),
          new CloudExporter(),
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(),
        ],
      },
    },
  }),
});
