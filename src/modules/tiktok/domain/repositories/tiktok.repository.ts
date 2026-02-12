import { TokenResponse } from '../types/types';

export abstract class Repository {
  abstract getAuthorizationUrl(state: string): string;
  abstract exchangeCodeForToken(code: string): Promise<TokenResponse>;
}
