import { Elysia } from 'elysia';
import { uploadFileController } from '../infra/http/controllers/upload-file.controller';

import { deleteFileController } from '../infra/http/controllers/delete-file.controller';
import { getFileController } from '../infra/http/controllers/get-file.controller';
import { getVideoController } from '../infra/http/controllers/get-video.controller';

export const bucketRoutes = new Elysia()
    .use(uploadFileController)
    .use(getFileController)
    .use(getVideoController)
    .use(deleteFileController);
