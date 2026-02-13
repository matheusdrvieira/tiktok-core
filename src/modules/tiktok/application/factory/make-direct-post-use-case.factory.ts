import { DirectPostUseCase } from '../use-cases/direct-post.use-case';
import { TiktokService } from '../../infra/http/services/tiktok.service';
import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../../integrations/infra/http/services/integrations.service';

export const makeDirectPostUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  const tiktokService = new TiktokService();

  return new DirectPostUseCase(tiktokService, integrationsService);
};
