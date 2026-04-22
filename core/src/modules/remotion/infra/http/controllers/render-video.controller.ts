import { Elysia, t } from "elysia";
import { authGuard } from "../../../../../shared/middleware/auth-guard";
import { makeGetRenderVideoJobUseCase } from "../../../application/factory/make-get-render-video-job-use-case.factory";
import { makeStartRenderVideoJobUseCase } from "../../../application/factory/make-start-render-video-job-use-case.factory";
import { remotionTemplateIds } from "../../../domain/constants/remotion-template.constants";
import { RenderJobPresenter } from "../presenters/render-job.presenter";

const startRenderVideoJobUseCase = makeStartRenderVideoJobUseCase();
const getRenderVideoJobUseCase = makeGetRenderVideoJobUseCase();

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
      const job = await startRenderVideoJobUseCase.execute({
        userId: user.id,
        videoId: body.videoId,
        questions: body.questions,
        templateId: body.templateId,
      });

      set.status = 202;

      return {
        message: "Renderização iniciada.",
        job: RenderJobPresenter.toHttp(job),
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
  )
  .get(
    "/remotion/render/:jobId",
    async ({ params, user, set }) => {
      const job = await getRenderVideoJobUseCase.execute(user.id, params.jobId);

      if (!job) {
        set.status = 404;
        return { message: "Render job não encontrado." };
      }

      return {
        job: RenderJobPresenter.toHttp(job),
      };
    },
    {
      params: t.Object({
        jobId: t.String({ minLength: 1 }),
      }),
      auth: true,
    },
  );
