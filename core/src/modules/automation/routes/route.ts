import { Elysia } from 'elysia';
import { automationCron } from '../infra/cron/automation.cron';
import { runAutomationController } from '../infra/http/controllers/run-automation.controller';

export const automationRoutes = new Elysia()
  .use(automationCron)
  .use(runAutomationController);
