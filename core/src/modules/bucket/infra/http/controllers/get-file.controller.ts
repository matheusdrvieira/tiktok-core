import { Elysia, t } from 'elysia';
import { logAndReportError } from '../../../../../shared/lib/discord-error';
import { makeGetFileUseCase } from '../../../application/factory/make-get-file-use-case.factory';

const getFileUseCase = makeGetFileUseCase();

const parseRangeHeader = (rangeHeader: string, totalBytes: number): {
    start: number;
    end: number;
} | null => {
    if (!rangeHeader.startsWith('bytes=')) {
        return null;
    }

    const [rawStart, rawEnd] = rangeHeader.slice('bytes='.length).split('-', 2);

    if (!rawStart && !rawEnd) {
        return null;
    }

    if (!rawStart) {
        const suffixLength = Number(rawEnd);
        if (!Number.isFinite(suffixLength) || suffixLength <= 0) {
            return null;
        }

        const start = Math.max(totalBytes - Math.floor(suffixLength), 0);
        return {
            start,
            end: totalBytes - 1,
        };
    }

    const start = Number(rawStart);
    if (!Number.isFinite(start) || start < 0 || start >= totalBytes) {
        return null;
    }

    if (!rawEnd) {
        return {
            start: Math.floor(start),
            end: totalBytes - 1,
        };
    }

    const end = Number(rawEnd);
    if (!Number.isFinite(end) || end < start) {
        return null;
    }

    return {
        start: Math.floor(start),
        end: Math.min(Math.floor(end), totalBytes - 1),
    };
};

const audioQuerySchema = {
    query: t.Object({
        key: t.String({ minLength: 1 }),
    }),
};

export const getFileController = new Elysia().head(
    '/bucket/audio',
    async ({ query, set }) => {
        try {
            const body = await getFileUseCase.execute(query.key);
            const bytes = new Uint8Array(body);

            return new Response(null, {
                status: 200,
                headers: {
                    'content-type': 'audio/mpeg',
                    'content-length': String(bytes.byteLength),
                    'accept-ranges': 'bytes',
                    'cache-control': 'no-store',
                },
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load audio metadata from bucket.';
            const isNotFound = /NoSuchKey|NotFound|not found/i.test(message);
            if (!isNotFound) {
                logAndReportError('[bucket][headFile] error:', err);
            }
            set.status = isNotFound ? 404 : 500;
            return;
        }
    },
    audioQuerySchema,
).get(
    '/bucket/audio',
    async ({ query, request, set }) => {
        try {
            const body = await getFileUseCase.execute(query.key);
            const bytes = new Uint8Array(body);
            const totalBytes = bytes.byteLength;
            const rangeHeader = request.headers.get('range');

            if (rangeHeader) {
                const range = parseRangeHeader(rangeHeader, totalBytes);

                if (!range) {
                    return new Response(null, {
                        status: 416,
                        headers: {
                            'content-range': `bytes */${totalBytes}`,
                            'accept-ranges': 'bytes',
                            'cache-control': 'no-store',
                        },
                    });
                }

                const chunk = bytes.slice(range.start, range.end + 1);

                return new Response(chunk, {
                    status: 206,
                    headers: {
                        'content-type': 'audio/mpeg',
                        'content-length': String(chunk.byteLength),
                        'accept-ranges': 'bytes',
                        'content-range': `bytes ${range.start}-${range.end}/${totalBytes}`,
                        'cache-control': 'no-store',
                    },
                });
            }

            return new Response(bytes, {
                status: 200,
                headers: {
                    'content-type': 'audio/mpeg',
                    'content-length': String(totalBytes),
                    'accept-ranges': 'bytes',
                    'cache-control': 'no-store',
                },
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load audio from bucket.';
            const isNotFound = /NoSuchKey|NotFound|not found/i.test(message);
            if (!isNotFound) {
                logAndReportError('[bucket][getFile] error:', err);
            }
            set.status = isNotFound ? 404 : 500;
            return { message };
        }
    },
    audioQuerySchema,
);
