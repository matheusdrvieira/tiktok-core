import { RunAutomationJobUseCase } from '../use-cases/run-automation-job.use-case';

export class AutomationRunnerService {
  private isRunning = false;

  constructor(private readonly runAutomationJobUseCase: RunAutomationJobUseCase) { }

  async run(): Promise<void> {
    if (this.isRunning) {
      console.warn('[automation] skipping run because this process is already running one.');
      return;
    }

    this.isRunning = true;

    try {
      await this.runAutomationJobUseCase.execute();
    } finally {
      this.isRunning = false;
    }
  }
}
