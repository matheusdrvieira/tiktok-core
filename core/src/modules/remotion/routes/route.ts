import { Elysia } from "elysia";
import { renderVideoController } from "../infra/http/controllers/render-video.controller";

export const remotionRoutes = new Elysia().use(renderVideoController);
