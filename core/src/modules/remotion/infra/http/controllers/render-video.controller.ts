import { Elysia, t } from "elysia";
import { authGuard } from "../../../../../shared/middleware/auth-guard";
import { makeRenderVideoUseCase } from "../../../application/factory/make-render-video-use-case.factory";
import { VideoPresenter } from "../../../../videos/infra/http/presenters/video.presenter";
import { remotionTemplateIds } from "../../../domain/constants/remotion-template.constants";

const renderVideoUseCase = makeRenderVideoUseCase();

const questionOptionSchema = t.Object({
  id: t.String({ minLength: 1 }),
  text: t.String({ minLength: 1 }),
});

const questionSchema = t.Object({
  id: t.String({ minLength: 1 }),
  question: t.String({ minLength: 1 }),
  options: t.Array(questionOptionSchema, { minItems: 4, maxItems: 4 }),
  answer: t.Object({
    correctAnswerIndex: t.Number({ minimum: 0, maximum: 3 }),
  }),
  questionPath: t.String({ minLength: 1 }),
  answerCorrectPath: t.String({ minLength: 1 }),
});

const templateIdSchema = t.Union([
  t.Literal(remotionTemplateIds[0]),
  t.Literal(remotionTemplateIds[1]),
  t.Literal(remotionTemplateIds[2]),
]);

export const renderVideoController = new Elysia()
  .use(authGuard)
  .post(
    "/remotion/render",
    async ({ body, user, set }) => {
      const rendered = await renderVideoUseCase.execute({
        userId: user.id,
        videoId: body.videoId,
        questions: body.questions,
        templateId: body.templateId,
      });

      set.status = 201;

      return {
        message: "Vídeo renderizado com sucesso.",
        video: {
          ...VideoPresenter.toHttp(rendered.video),
          path: rendered.url,
          key: rendered.key,
        },
        templateId: rendered.templateId,
      };
    },
    {
      body: t.Object({
        videoId: t.String({ minLength: 1 }),
        questions: t.Array(questionSchema, { minItems: 4, maxItems: 10 }),
        templateId: t.Optional(templateIdSchema),
      }),
      auth: true,
    },
  );
