import "dotenv/config";
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.url().min(1),
  FRONTEND_URL: z.url(),
  REMOTION_URL: z.url(),
  BACKEND_URL: z.url(),
  MCP_URL: z.url().default('http://localhost:8080'),
  AUTOMATION_USER_ID: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  TIKTOK_CLIENT_KEY: z.string().min(1),
  TIKTOK_CLIENT_SECRET: z.string().min(1),
  TIKTOK_REDIRECT_URI: z.url(),
  YOUTUBE_CLIENT_ID: z.string().min(1),
  YOUTUBE_CLIENT_SECRET: z.string().min(1),
  YOUTUBE_REDIRECT_URI: z.url(),
  WEB_APP_DIR: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1),
  TTS_BASE_URL: z.url().default('http://localhost:8880'),
  MINIO_ENDPOINT: z.url().min(1),
  MINIO_BUCKET_NAME: z.string().min(1),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
