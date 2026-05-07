import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../../integrations/infra/http/services/integrations.service';
import { TiktokService } from '../../infra/http/services/tiktok.service';
import { FetchPublishStatusUseCase } from '../use-cases/fetch-publish-status.use-case';

export const makeFetchPublishStatusUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  const tiktokService = new TiktokService();

  return new FetchPublishStatusUseCase(tiktokService, integrationsService);
};
