import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { routes } from './modules/routes/route';
import { env } from './shared/config/env';

const app = new Elysia()
  .use(
    cors({
      origin: [env.FRONTEND_URL, env.REMOTION_URL],
      methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Range"],
      exposeHeaders: ["Content-Length", "Content-Range", "Accept-Ranges", "Content-Type"],
    }),
  )
  .use(routes)
  .get("/health", () => ({ ok: true }))
  .listen({
    port: env.PORT,
    hostname: "0.0.0.0",
    idleTimeout: 120,
  });

console.log(`API running at ${app.server?.hostname}:${app.server?.port}`);
