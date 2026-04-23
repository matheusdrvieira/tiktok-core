import { cron } from '@elysiajs/cron';
import { logAndReportError } from '../../../../shared/lib/discord-error';
import { makeAutomationRunnerService } from '../../application/factory/make-automation-runner-service.factory';

const FIXED_AUTOMATION_CRON_PATTERN = '0 0,6,12,15,18,21 * * *';
const automationRunnerService = makeAutomationRunnerService();

export const automationCron = cron({
  name: 'automation-pipeline',
  pattern: FIXED_AUTOMATION_CRON_PATTERN,
  run: async () => {
    try {
      await automationRunnerService.run();
    } catch (error) {
      logAndReportError('[automation][cron] run failed:', error);
    }
  },
});
