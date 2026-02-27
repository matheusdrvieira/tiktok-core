import axios from 'axios';
import { createReadStream } from 'node:fs';
import { env } from '../../../../../shared/config/env';
import { TiktokRepository } from '../../../domain/repositories/tiktok.repository';
import {
  CreatorInfoQueryInput,
  CreatorInfoQueryOutput,
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

const FILE_UPLOAD_SOURCE = 'FILE_UPLOAD';

export class TiktokService extends TiktokRepository {
  private readonly authorizeEndpoint =
    'https://www.tiktok.com/v2/auth/authorize/';
  private readonly scope = 'user.info.basic,video.publish';

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

  async queryCreatorInfo(
    input: CreatorInfoQueryInput,
  ): Promise<CreatorInfoQueryOutput> {
    const { data } = await api.post(
      '/post/publish/creator_info/query/',
      {},
      {
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const creatorInfo = data.data;

    return {
      creatorAvatarUrl: creatorInfo.creator_avatar_url,
      creatorUsername: creatorInfo.creator_username,
      creatorNickname: creatorInfo.creator_nickname,
      privacyLevelOptions: creatorInfo.privacy_level_options,
      commentDisabled: creatorInfo.comment_disabled,
      duetDisabled: creatorInfo.duet_disabled,
      stitchDisabled: creatorInfo.stitch_disabled,
      maxVideoPostDurationSec: creatorInfo.max_video_post_duration_sec,
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
          privacy_level:
            env.NODE_ENV === 'development'
              ? TiktokPrivacyLevelEnum.SELF_ONLY
              : TiktokPrivacyLevelEnum.PUBLIC_TO_EVERYONE,
          disable_comment: false,
          disable_duet: true,
          disable_stitch: true,
        },
        source_info: {
          source: FILE_UPLOAD_SOURCE,
          video_size: input.videoSize,
          chunk_size: input.videoSize,
          total_chunk_count: 1,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      publishId: data?.data?.publish_id,
      uploadUrl: data?.data?.upload_url,
    };
  }

  async uploadDirectPostVideo(
    input: DirectPostUploadInput,
  ): Promise<DirectPostUploadOutput> {
    await axios.put(input.uploadUrl, createReadStream(input.videoPath), {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(input.contentLength),
        'Content-Range': `bytes 0-${input.contentLength - 1}/${input.contentLength}`,
      },
      responseType: 'text',
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return {
      publishId: '',
      uploadUrl: input.uploadUrl
    };
  }
}
