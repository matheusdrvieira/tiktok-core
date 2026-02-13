import { Integration } from '../entities/integrations.entity';
import { IntegrationProvider } from '../entities/integrations.entity';
import { AsyncMaybe } from '../../../../shared/core/domain/logic/maybe';

export abstract class IntegrationsRepository {
  abstract create(props: Integration): Promise<Integration>;
  abstract list(userId: string): Promise<Integration[]>;
  abstract findByUserId(
    userId: string,
    provider: IntegrationProvider,
  ): AsyncMaybe<Integration>;
}
