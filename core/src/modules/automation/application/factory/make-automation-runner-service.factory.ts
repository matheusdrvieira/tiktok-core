import { AutomationRunnerService } from '../services/automation-runner.service';
import { makeRunAutomationJobUseCase } from './make-run-automation-job-use-case.factory';

export const makeAutomationRunnerService = () => {
  const runAutomationJobUseCase = makeRunAutomationJobUseCase();

  return new AutomationRunnerService(runAutomationJobUseCase);
};
