import { Elysia, t } from 'elysia';
import { makeDeleteFileUseCase } from '../../../application/factory/make-delete-file-use-case.factory';

const deleteFileUseCase = makeDeleteFileUseCase();

export const deleteFileController = new Elysia()
    .delete(
        '/bucket/files',
        async ({ body, set }) => {
            const { key } = body;
            await deleteFileUseCase.execute(key);
            set.status = 200;
            return { message: 'File deleted successfully' };
        },
        {
            body: t.Object({
                key: t.String(),
            }),
            auth: true,
        }
    );
