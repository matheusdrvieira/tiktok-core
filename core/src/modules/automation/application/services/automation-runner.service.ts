import { RunAutomationJobUseCase } from '../use-cases/run-automation-job.use-case';

const AUTOMATION_RUN_TIMEOUT_MS = 2 * 60 * 60 * 1000;

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
      await this.runWithTimeout();
    } finally {
      this.isRunning = false;
    }
  }

  private async runWithTimeout(): Promise<void> {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        this.runAutomationJobUseCase.execute(),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => {
            reject(new Error(
              `[automation] run timed out after ${AUTOMATION_RUN_TIMEOUT_MS / 60_000} minutes.`,
            ));
          }, AUTOMATION_RUN_TIMEOUT_MS);
        }),
      ]);
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }
}
