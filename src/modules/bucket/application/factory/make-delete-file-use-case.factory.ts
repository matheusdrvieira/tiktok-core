import { MinioService } from '../../infra/http/services/minio.service';
import { DeleteFileUseCase } from '../use-cases/delete-file.use-case';

export const makeDeleteFileUseCase = () => {
    const minioService = new MinioService();
    return new DeleteFileUseCase(minioService);
};
