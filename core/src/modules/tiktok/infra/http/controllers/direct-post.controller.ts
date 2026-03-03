import { Elysia, t } from 'elysia';
import { authGuard } from '../../../../../shared/middleware/auth-guard';
import { makeDirectPostUseCase } from '../../../application/factory/make-direct-post-use-case.factory';

const directPostUseCase = makeDirectPostUseCase();
const privacyLevelSchema = t.Union([
  t.Literal('PUBLIC_TO_EVERYONE'),
  t.Literal('MUTUAL_FOLLOW_FRIENDS'),
  t.Literal('SELF_ONLY'),
  t.Literal('FOLLOWER_OF_CREATOR'),
]);

export const directPostController = new Elysia()
  .use(authGuard)
  .post(
    '/tiktok/post/direct',
    async ({ body, user }) => {
      return await directPostUseCase.execute({
        userId: user.id,
        videoId: body.videoId,
        videoPath: body.videoPath,
        title: body.title,
        privacyLevel: body.privacyLevel,
        disableComment: body.disableComment,
        disableDuet: body.disableDuet,
        disableStitch: body.disableStitch,
        brandContentToggle: body.brandContentToggle,
        brandOrganicToggle: body.brandOrganicToggle,
      });
    },
    {
      body: t.Object({
        videoId: t.Optional(t.String({ minLength: 1 })),
        videoPath: t.String({ minLength: 1 }),
        title: t.String({ minLength: 1, maxLength: 2200 }),
        privacyLevel: privacyLevelSchema,
        disableComment: t.Boolean(),
        disableDuet: t.Boolean(),
        disableStitch: t.Boolean(),
        brandContentToggle: t.Boolean(),
        brandOrganicToggle: t.Boolean(),
      }),
      auth: true,
    },
  );
