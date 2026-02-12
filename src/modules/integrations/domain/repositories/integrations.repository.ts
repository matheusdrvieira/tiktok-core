import { Integration } from '../entities/integrations.entity';

export abstract class IntegrationsRepository {
  abstract create(props: Integration): Promise<Integration>;
  abstract list(): Promise<Integration[]>;
  abstract findByUserId(userId: string): Promise<Integration[]>;
}
