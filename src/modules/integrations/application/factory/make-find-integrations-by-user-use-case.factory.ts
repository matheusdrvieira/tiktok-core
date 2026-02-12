import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../infra/http/services/integrations.service';
import { FindIntegrationsByUserUseCase } from '../use-cases/find-integrations-by-user.use-case';

export const makeFindIntegrationsByUserUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  return new FindIntegrationsByUserUseCase(integrationsService);
};
