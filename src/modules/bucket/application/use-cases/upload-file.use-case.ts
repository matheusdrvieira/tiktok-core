import { BucketRepository } from "../../domain/repositories/bucket.repository";

export class UploadFileUseCase {
    constructor(private readonly bucketRepository: BucketRepository) { }

    async execute(input: {
        key: string;
        body: ArrayBuffer | Uint8Array | Buffer | Blob | File;
        contentType?: string;
    }) {
        return await this.bucketRepository.uploadFile(input);
    }
}
