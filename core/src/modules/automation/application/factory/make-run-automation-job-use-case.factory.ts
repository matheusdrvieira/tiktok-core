import { PrismaService } from '../../../../shared/database/prisma.service';
import { makeGenerateNarrationUseCase } from '../../../ai/application/factory/make-generate-narration-use-case.factory';
import { makeGenerateQuizUseCase } from '../../../ai/application/factory/make-generate-quiz-use-case.factory';
import { makeCreateQuizUseCase } from '../../../quizzes/application/factory/make-create-quiz-use-case.factory';
import { makeRenderVideoUseCase } from '../../../remotion/application/factory/make-render-video-use-case.factory';
import { makeDirectPostUseCase } from '../../../tiktok/application/factory/make-direct-post-use-case.factory';
import { makeCreateVideoUseCase } from '../../../videos/application/factory/make-create-video-use-case.factory';
import { makeUploadVideoUseCase } from '../../../youtube/application/factory/make-upload-video-use-case.factory';
import { AutomationService } from '../../infra/http/services/automation.service';
import { RunAutomationJobUseCase } from '../use-cases/run-automation-job.use-case';

export const makeRunAutomationJobUseCase = () => {
  const prisma = new PrismaService();
  const createQuizUseCase = makeCreateQuizUseCase();
  const createVideoUseCase = makeCreateVideoUseCase();
  const generateQuizUseCase = makeGenerateQuizUseCase();
  const generateNarrationUseCase = makeGenerateNarrationUseCase();
  const renderVideoUseCase = makeRenderVideoUseCase();
  const directPostUseCase = makeDirectPostUseCase();
  const uploadVideoUseCase = makeUploadVideoUseCase();
  const automationService = new AutomationService(prisma);

  return new RunAutomationJobUseCase(
    createQuizUseCase,
    createVideoUseCase,
    generateQuizUseCase,
    generateNarrationUseCase,
    renderVideoUseCase,
    directPostUseCase,
    uploadVideoUseCase,
    automationService,
  );
};
