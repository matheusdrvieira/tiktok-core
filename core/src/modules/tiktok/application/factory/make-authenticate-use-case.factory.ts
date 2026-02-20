import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../../integrations/infra/http/services/integrations.service';
import { AuthenticateUseCase } from '../use-cases/authenticate.use-case';
import { TiktokService } from '../../infra/http/services/tiktok.service';

export const makeAuthenticateUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  const tiktokService = new TiktokService();

  return new AuthenticateUseCase(tiktokService, integrationsService);
};
