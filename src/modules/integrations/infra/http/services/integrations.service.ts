import { PrismaService } from '../../../../../shared/database/prisma.service';
import { decryptJson, encryptJson } from '../../../../../shared/utils/json-crypto';
import {
  Integration,
  IntegrationProvider,
} from '../../../domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../../domain/repositories/integrations.repository';

export class IntegrationsService implements IntegrationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(props: Integration): Promise<Integration> {
    const integration = await this.prisma.integrations.upsert({
      where: {
        userId_provider: {
          userId: props.userId,
          provider: props.provider,
        },
      },
      create: {
        userId: props.userId,
        provider: props.provider,
        isActive: props.isActive ?? true,
        credentials: encryptJson(props.credentials),
      },
      update: {
        isActive: props.isActive ?? true,
        credentials: encryptJson(props.credentials),
      },
    });

    return Integration.create({
      id: integration.id,
      userId: integration.userId,
      provider: IntegrationProvider[integration.provider],
      isActive: integration.isActive,
      credentials: props.credentials,
      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt,
    });
  }

  async list(): Promise<Integration[]> {
    const integrations = await this.prisma.integrations.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return integrations.map((integration) =>
      Integration.create({
        id: integration.id,
        userId: integration.userId,
        provider: IntegrationProvider[integration.provider],
        isActive: integration.isActive,
        credentials: decryptJson(integration.credentials),
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
      }),
    );
  }

  async findByUserId(userId: string): Promise<Integration[]> {
    const integrations = await this.prisma.integrations.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return integrations.map((integration) =>
      Integration.create({
        id: integration.id,
        userId: integration.userId,
        provider: IntegrationProvider[integration.provider],
        isActive: integration.isActive,
        credentials: decryptJson(integration.credentials),
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
      }),
    );
  }
}
