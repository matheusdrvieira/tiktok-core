import { MinioService } from '../../infra/http/services/minio.service';
import { GetFileUseCase } from '../use-cases/get-file.use-case';

export const makeGetFileUseCase = () => {
    const minioService = new MinioService();
    return new GetFileUseCase(minioService);
};
