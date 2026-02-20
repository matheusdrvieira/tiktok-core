import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../infra/http/services/integrations.service';
import { CreateIntegrationUseCase } from '../use-cases/create-integration.use-case';

export const makeCreateIntegrationUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  return new CreateIntegrationUseCase(integrationsService);
};
