import { Elysia } from 'elysia';
import { aiRoutes } from '../ai/routes/route';
import { automationRoutes } from '../automation/routes/route';
import { bucketRoutes } from '../bucket/routes/route';
import { integrationsRoutes } from '../integrations/routes/route';
import { quizzesRoutes } from '../quizzes/routes/route';
import { remotionRoutes } from '../remotion/routes/route';
import { tiktokRoutes } from '../tiktok/routes/route';
import { videosRoutes } from '../videos/routes/route';
import { youtubeRoutes } from '../youtube/routes/route';

export const routes = new Elysia()
    .use(aiRoutes)
    .use(automationRoutes)
    .use(integrationsRoutes)
    .use(tiktokRoutes)
    .use(youtubeRoutes)
    .use(remotionRoutes)
    .use(videosRoutes)
    .use(quizzesRoutes)
    .use(bucketRoutes);
