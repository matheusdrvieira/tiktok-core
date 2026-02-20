import { Integration } from '../../domain/entities/integrations.entity';
import { IntegrationsRepository } from '../../domain/repositories/integrations.repository';

export class CreateIntegrationUseCase {
  constructor(private readonly repository: IntegrationsRepository) {}

  async execute(props: Integration): Promise<Integration> {
    return await this.repository.create(props);
  }
}
