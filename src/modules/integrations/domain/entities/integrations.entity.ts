import { Entity } from '../../../../shared/core/domain/entity';

export enum IntegrationProvider {
    TIKTOK = 'TIKTOK',
    YOUTUBE = 'YOUTUBE',
    KWAI = 'KWAI',
}

export type IntegrationProps = {
    id?: string;
    userId: string;
    provider: IntegrationProvider;
    isActive?: boolean;
    credentials: Record<string, unknown>;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Integration extends Entity<IntegrationProps> {
    get id() {
        return this.props.id;
    }

    get userId() {
        return this.props.userId;
    }

    get provider() {
        return this.props.provider;
    }

    get isActive() {
        return this.props.isActive;
    }

    get credentials() {
        return this.props.credentials;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(props: IntegrationProps): Integration {
        return new Integration(props);
    }
}
