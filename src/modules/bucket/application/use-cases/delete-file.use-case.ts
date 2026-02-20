import { BucketRepository } from '../../domain/repositories/bucket.repository';

export class DeleteFileUseCase {
    constructor(private readonly bucketRepository: BucketRepository) { }

    async execute(key: string): Promise<void> {
        await this.bucketRepository.deleteFile(key);
    }
}
