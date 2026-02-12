import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { routes } from './modules/routes/route';
import { env } from './shared/config/env';
import { auth } from './shared/lib/better-auth';

const app = new Elysia()
  .use(
    cors({
      origin: env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .mount(auth.handler)
  .use(routes)
  .listen({
    port: env.PORT,
    hostname: "0.0.0.0"
  });

console.log(`API running at ${app.server?.hostname}:${app.server?.port}`);