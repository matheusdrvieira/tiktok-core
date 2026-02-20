import { BucketRepository } from '../../domain/repositories/bucket.repository';

export class GetFileUseCase {
    constructor(private readonly bucketRepository: BucketRepository) { }

    async execute(key: string): Promise<ArrayBuffer> {
        return await this.bucketRepository.getFile(key);
    }
}
