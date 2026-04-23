import { renderMedia, selectComposition } from "@remotion/renderer";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { env } from "../../../../shared/config/env";
import { logAndReportError } from "../../../../shared/lib/discord-error";
import { UploadFileUseCase } from "../../../bucket/application/use-cases/upload-file.use-case";
import { UpdateVideoUrlUseCase } from "../../../videos/application/use-cases/update-video-url.use-case";
import { VideoStatus } from "../../../videos/domain/entities/videos.entity";
import {
  RemotionTemplateId,
  remotionTemplateIds,
} from "../../domain/constants/remotion-template.constants";
import {
  RenderVideoRequest,
  RenderVideoResponse,
} from "../../domain/types/types";

const pickRandomTemplateId = (): RemotionTemplateId => {
  const randomIndex = Math.floor(Math.random() * remotionTemplateIds.length);
  return remotionTemplateIds[randomIndex] ?? remotionTemplateIds[0];
};

export class RenderVideoUseCase {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly updateVideoUrlUseCase: UpdateVideoUrlUseCase,
  ) { }

  async execute(props: RenderVideoRequest): Promise<RenderVideoResponse> {
    const tempDirPath = await mkdtemp(path.join(tmpdir(), "quizzio-remotion-render-"));
    const outputPath = path.join(tempDirPath, "render.mp4");
    const templateId = props.templateId ?? pickRandomTemplateId();

    try {
      const renderResult = await this.renderWithRemotion(props, outputPath, templateId);

      const videoBuffer = await readFile(outputPath);
      const key = `videos/${props.userId}/${randomUUID()}.mp4`;

      await this.uploadFileUseCase.execute({
        key,
        body: videoBuffer,
        contentType: "video/mp4",
      });

      const videoUrl = `${env.BACKEND_URL}/bucket/video?key=${encodeURIComponent(key)}`;
      const video = await this.updateVideoUrlUseCase.execute(
        props.userId,
        props.videoId,
        {
          url: videoUrl,
          size: videoBuffer.byteLength,
          duration: renderResult.duration,
          status: VideoStatus.RENDERED,
        },
      );

      if (!video) throw new Error("Video not found for this user.");

      return {
        video,
        key,
        url: videoUrl,
        templateId,
      };
    } finally {
      await rm(tempDirPath, { recursive: true, force: true });
    }
  }

  private async renderWithRemotion(
    props: RenderVideoRequest,
    outputPath: string,
    templateId: RemotionTemplateId,
  ): Promise<{ duration: number }> {
    try {
      const composition = await selectComposition({
        serveUrl: env.REMOTION_URL,
        id: "MyComp",
        inputProps: {
          questions: props.questions,
          templateId,
        },
      });

      await renderMedia({
        serveUrl: env.REMOTION_URL,
        composition,
        codec: "h264",
        outputLocation: outputPath,
        inputProps: {
          questions: props.questions,
          templateId,
        },
        imageFormat: "jpeg",
        x264Preset: "veryfast",
        concurrency: 1,
        timeoutInMilliseconds: 20 * 60 * 1000,
      });

      return {
        duration: composition.durationInFrames / composition.fps,
      };
    } catch (error) {
      logAndReportError('[remotion][renderWithRemotion] error:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  }
}
