import "dotenv/config";
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).default(8080),
  OPENAI_API_KEY: z.string().min(1),
  DATABASE_URL: z.url().min(1),
  BACKEND_URL: z.url().min(1),
  MASTRA_CLOUD_ACCESS_TOKEN: z.string().min(1),
  DISCORD_ERROR_WEBHOOK_URL: z.url().optional(),
});

export const env = envSchema.parse(process.env);
