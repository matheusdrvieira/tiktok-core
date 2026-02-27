import { PrismaService } from "../../../../shared/database/prisma.service";
import { VideosService } from "../../infra/http/services/videos.service";
import { UpdateVideoUrlUseCase } from "../use-cases/update-video-url.use-case";

export const makeUpdateVideoUrlUseCase = () => {
  const prisma = new PrismaService();
  const videosService = new VideosService(prisma);
  return new UpdateVideoUrlUseCase(videosService);
};
