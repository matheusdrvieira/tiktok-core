import { PrismaService } from '../../../../shared/database/prisma.service';
import { IntegrationsService } from '../../infra/http/services/integrations.service';
import { ListIntegrationsUseCase } from '../use-cases/list-integrations.use-case';

export const makeListIntegrationsUseCase = () => {
  const prisma = new PrismaService();
  const integrationsService = new IntegrationsService(prisma);
  return new ListIntegrationsUseCase(integrationsService);
};
