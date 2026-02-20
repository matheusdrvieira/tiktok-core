import { UploadFileUseCase } from '../../../bucket/application/use-cases/upload-file.use-case';
import { MinioService } from '../../../bucket/infra/http/services/minio.service';
import { AiService } from '../../infra/http/services/ai.service';
import { GenerateNarrationUseCase } from '../use-cases/generate-narration.use-case';

export const makeGenerateNarrationUseCase = () => {
    const aiService = new AiService();

    const bucketService = new MinioService();
    const uploadFileUseCase = new UploadFileUseCase(bucketService);

    return new GenerateNarrationUseCase(aiService, uploadFileUseCase);
};
