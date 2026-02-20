export interface BucketRepository {
    uploadFile(input: {
        key: string;
        body: ArrayBuffer | Uint8Array | Buffer | Blob | File;
        contentType?: string;
    }): Promise<{ key: string; url: string }>;
    getFile(key: string): Promise<ArrayBuffer>;
    deleteFile(key: string): Promise<void>;
}
