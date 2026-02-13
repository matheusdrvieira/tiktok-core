import { Integration } from '../../domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../domain/repositories/integrations.repository';

export class ListIntegrationsUseCase {
  constructor(private readonly repository: IntegrationsRepository) {}

  async execute(userId: string): Promise<Integration[]> {
    return await this.repository.list(userId);
  }
}
