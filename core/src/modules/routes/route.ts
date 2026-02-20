import { Elysia } from 'elysia';
import { aiRoutes } from '../ai/routes/route';
import { bucketRoutes } from '../bucket/routes/route';
import { integrationsRoutes } from '../integrations/routes/route';
import { tiktokRoutes } from '../tiktok/routes/route';
import { videosRoutes } from '../videos/routes/route';

export const routes = new Elysia()
    .use(aiRoutes)
    .use(integrationsRoutes)
    .use(tiktokRoutes)
    .use(videosRoutes)
    .use(bucketRoutes);
