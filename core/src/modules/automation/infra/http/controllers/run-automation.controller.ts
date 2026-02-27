import { Elysia } from 'elysia';
import { makeAutomationRunnerService } from '../../../application/factory/make-automation-runner-service.factory';

const automationRunnerService = makeAutomationRunnerService();

export const runAutomationController = new Elysia()
  .post('/automation/run', async ({ set }) => {
    await automationRunnerService.run();

    set.status = 204;
    return;
  });
