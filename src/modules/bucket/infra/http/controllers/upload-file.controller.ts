import { Elysia, t } from 'elysia';
import { randomUUID } from 'node:crypto';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeUploadFileUseCase } from '../../../application/factory/make-upload-file-use-case.factory';

const uploadFileUseCase = makeUploadFileUseCase();

export const uploadFileController = new Elysia()
    .use(authGuard)
    .post(
        '/bucket/upload',
        async ({ body, set }) => {
            const file = body.file;
            const safeFileName = file.name
                .trim()
                .replace(/[^a-zA-Z0-9._-]+/g, '-');
            const key = `uploads/${randomUUID()}-${safeFileName}`;

            const result = await uploadFileUseCase.execute({
                key,
                body: file,
                contentType: file.type || undefined,
            });

            set.status = 201;
            return result;
        },
        {
            body: t.Object({
                file: t.File(),
            }),
            auth: true,
        }
    );
