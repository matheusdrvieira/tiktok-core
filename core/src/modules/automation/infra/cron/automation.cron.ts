import { cron } from '@elysiajs/cron';
import { makeAutomationRunnerService } from '../../application/factory/make-automation-runner-service.factory';

const FIXED_AUTOMATION_CRON_PATTERN = '0 0,6,10,12,16,20 * * *';
const automationRunnerService = makeAutomationRunnerService();

export const automationCron = cron({
  name: 'automation-pipeline',
  pattern: FIXED_AUTOMATION_CRON_PATTERN,
  run: async () => await automationRunnerService.run()
});
