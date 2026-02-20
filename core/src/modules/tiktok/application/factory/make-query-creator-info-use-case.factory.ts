import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../../integrations/infra/http/services/integrations.service';
import { TiktokService } from '../../infra/http/services/tiktok.service';
import { QueryCreatorInfoUseCase } from '../use-cases/query-creator-info.use-case';

export const makeQueryCreatorInfoUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  const tiktokService = new TiktokService();

  return new QueryCreatorInfoUseCase(tiktokService, integrationsService);
};
