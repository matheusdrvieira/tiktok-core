import { RunAutomationJobUseCase } from '../use-cases/run-automation-job.use-case';

export class AutomationRunnerService {
  constructor(private readonly runAutomationJobUseCase: RunAutomationJobUseCase) { }

  async run(): Promise<void> {
    await this.runAutomationJobUseCase.execute();
  }
}
