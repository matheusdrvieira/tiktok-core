import { Integration } from '../../domain/entities/integrations.entity';
import { IntegrationProvider } from '../../domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../domain/repositories/integrations.repository';
import { AsyncMaybe } from '../../../../shared/core/domain/logic/maybe';

export class FindIntegrationsByUserUseCase {
  constructor(private readonly repository: IntegrationsRepository) {}

  async execute(
    userId: string,
    provider: IntegrationProvider,
  ): AsyncMaybe<Integration> {
    return await this.repository.findByUserId(userId, provider);
  }
}
