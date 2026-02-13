import axios from 'axios';
import { createReadStream } from 'node:fs';
import { env } from '../../../../../shared/config/env';
import { TiktokRepository } from '../../../domain/repositories/tiktok.repository';
import {
  DirectPostInitInput,
  DirectPostInitOutput,
  DirectPostUploadInput,
  DirectPostUploadOutput,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenResponse
} from '../../../domain/types/types';

const api = axios.create({
  baseURL: 'https://open.tiktokapis.com/v2',
});

enum TiktokPrivacyLevelEnum {
  PUBLIC_TO_EVERYONE = "PUBLIC_TO_EVERYONE",
  MUTUAL_FOLLOW_FRIENDS = "MUTUAL_FOLLOW_FRIENDS",
  FOLLOWER_OF_CREATOR = "FOLLOWER_OF_CREATOR",
  SELF_ONLY = "SELF_ONLY"
}

export class TiktokService extends TiktokRepository {
  private readonly authorizeEndpoint =
    'https://www.tiktok.com/v2/auth/authorize/';
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
    const { data } = await api.post(
      '/oauth/token/',
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

  async refreshToken(
    props: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const { data } = await api.post(
      '/oauth/token/',
      new URLSearchParams({
        client_key: env.TIKTOK_CLIENT_KEY,
        client_secret: env.TIKTOK_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: props.refreshToken,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      refreshExpiresIn: data.refresh_expires_in,
      openId: data.open_id,
    };
  }

  async initDirectPost(
    input: DirectPostInitInput,
  ): Promise<DirectPostInitOutput> {
    const { data } = await api.post(
      '/post/publish/video/init/',
      {
        post_info: {
          title: input.title,
          privacy_level: TiktokPrivacyLevelEnum.PUBLIC_TO_EVERYONE,
          disable_comment: false,
          disable_duet: true,
          disable_stitch: true,
        },
        source_info: {
          source: 'FILE_UPLOAD',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      publishId: data.publish_id,
      uploadUrl: data.upload_url
    };
  }

  async uploadDirectPostVideo(
    input: DirectPostUploadInput,
  ): Promise<DirectPostUploadOutput> {
    const { data } = await axios.put(input.uploadUrl, createReadStream(input.videoPath), {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(input.contentLength),
      },
      responseType: 'text',
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return {
      publishId: data.publish_id,
      uploadUrl: data.upload_url
    };
  }
}
