import { S3Client } from "bun";
import { env } from "../../../../../shared/config/env";
import { BucketRepository } from "../../../domain/repositories/bucket.repository";

export class MinioService implements BucketRepository {
    private readonly client: S3Client;

    constructor() {
        this.client = new S3Client({
            accessKeyId: env.MINIO_ACCESS_KEY,
            secretAccessKey: env.MINIO_SECRET_KEY,
            endpoint: env.MINIO_ENDPOINT,
            region: "us-east-1",
            bucket: env.MINIO_BUCKET_NAME,
        });
    }

    async uploadFile(input: {
        key: string;
        body: ArrayBuffer | Uint8Array | Buffer | Blob | File;
        contentType?: string;
    }): Promise<{ key: string; url: string }> {
        const s3File = this.client.file(input.key);

        await s3File.write(input.body, {
            type: input.contentType ?? "audio/mpeg",
        });

        return {
            key: input.key,
            url: `${env.MINIO_ENDPOINT}/${env.MINIO_BUCKET_NAME}/${input.key}`,
        };
    }

    async getFile(key: string): Promise<ArrayBuffer> {
        const s3File = this.client.file(key);
        return await s3File.arrayBuffer();
    }

    async deleteFile(key: string): Promise<void> {
        await this.client.file(key).delete();
    }
}
