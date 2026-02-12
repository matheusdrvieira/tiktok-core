import { Elysia } from 'elysia';
import { integrationsRoutes } from '../integrations/routes/route';
import { tiktokRoutes } from '../tiktok/routes/route';
import { videosRoutes } from '../videos/routes/route';

export const routes = new Elysia()
    .use(integrationsRoutes)
    .use(tiktokRoutes)
    .use(videosRoutes);
