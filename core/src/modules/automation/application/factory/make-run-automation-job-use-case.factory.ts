import { makeCreateQuizUseCase } from '../../../quizzes/application/factory/make-create-quiz-use-case.factory';
import { makeRenderVideoUseCase } from '../../../remotion/application/factory/make-render-video-use-case.factory';
import { makeDirectPostUseCase } from '../../../tiktok/application/factory/make-direct-post-use-case.factory';
import { makeCreateVideoUseCase } from '../../../videos/application/factory/make-create-video-use-case.factory';
import { makeUploadVideoUseCase } from '../../../youtube/application/factory/make-upload-video-use-case.factory';
import { RunAutomationJobUseCase } from '../use-cases/run-automation-job.use-case';

export const makeRunAutomationJobUseCase = () => {
  const createQuizUseCase = makeCreateQuizUseCase();
  const createVideoUseCase = makeCreateVideoUseCase();
  const renderVideoUseCase = makeRenderVideoUseCase();
  const directPostUseCase = makeDirectPostUseCase();
  const uploadVideoUseCase = makeUploadVideoUseCase();

  return new RunAutomationJobUseCase(
    createQuizUseCase,
    createVideoUseCase,
    renderVideoUseCase,
    directPostUseCase,
    uploadVideoUseCase,
  );
};
