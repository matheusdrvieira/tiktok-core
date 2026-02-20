import { MinioService } from '../../infra/http/services/minio.service';
import { UploadFileUseCase } from '../use-cases/upload-file.use-case';

export const makeUploadFileUseCase = () => {
    const minioService = new MinioService();
    return new UploadFileUseCase(minioService);
};
