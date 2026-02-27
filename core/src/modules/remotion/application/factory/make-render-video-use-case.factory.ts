import { makeUploadFileUseCase } from "../../../bucket/application/factory/make-upload-file-use-case.factory";
import { makeUpdateVideoUrlUseCase } from "../../../videos/application/factory/make-update-video-url-use-case.factory";
import { RenderVideoUseCase } from "../use-cases/render-video.use-case";

export const makeRenderVideoUseCase = () => {
  const uploadFileUseCase = makeUploadFileUseCase();
  const updateVideoUrlUseCase = makeUpdateVideoUrlUseCase();

  return new RenderVideoUseCase(uploadFileUseCase, updateVideoUrlUseCase);
};
