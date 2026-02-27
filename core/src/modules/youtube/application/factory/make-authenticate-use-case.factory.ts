import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../../integrations/infra/http/services/integrations.service';
import { YoutubeService } from '../../infra/http/services/youtube.service';
import { AuthenticateUseCase } from '../use-cases/authenticate.use-case';

export const makeAuthenticateUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  const youtubeService = new YoutubeService();

  return new AuthenticateUseCase(youtubeService, integrationsService);
};
