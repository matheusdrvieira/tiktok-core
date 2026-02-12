import axios from 'axios';
import { env } from '../../../../../shared/config/env';
import { Repository as TiktokRepository } from '../../../domain/repositories/tiktok.repository';
import { TokenResponse } from '../../../domain/types/types';

interface TokenApiResponse {
  access_token: string;
  expires_in: number;
  open_id: string;
  refresh_token: string;
  refresh_expires_in: number;
}

export class TiktokService extends TiktokRepository {
  private readonly authorizeEndpoint =
    'https://www.tiktok.com/v2/auth/authorize/';
  private readonly tokenEndpoint =
    'https://open.tiktokapis.com/v2/oauth/token/';
  private readonly scope = 'user.info.basic';

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY,
      response_type: 'code',
      scope: this.scope,
      redirect_uri: env.TIKTOK_REDIRECT_URI,
      state,
    });

    return `${this.authorizeEndpoint}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const { data } = await axios.post<TokenApiResponse>(
      this.tokenEndpoint,
      new URLSearchParams({
        client_key: env.TIKTOK_CLIENT_KEY,
        client_secret: env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: env.TIKTOK_REDIRECT_URI,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      openId: data.open_id,
      refreshToken: data.refresh_token,
      refreshExpiresIn: data.refresh_expires_in,
    };
  }
}
