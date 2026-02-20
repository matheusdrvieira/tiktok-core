import { Integration } from '../../../domain/entities/integrations.entity';

export class IntegrationPresenter {
  static toHttp(integration: Integration) {
    return {
      id: integration.id,
      userId: integration.userId,
      provider: integration.provider,
      isActive: integration.isActive,
      credentials: integration.credentials,
      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt,
    };
  }
}
