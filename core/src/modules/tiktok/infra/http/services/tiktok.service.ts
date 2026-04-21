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
  TiktokPrivacyLevel,
  TokenResponse
} from '../../../domain/types/types';

const api = axios.create({
  baseURL: 'https://open.tiktokapis.com/v2',
});

const FILE_UPLOAD_SOURCE = 'FILE_UPLOAD';
const TIKTOK_PRIVACY_LEVELS: TiktokPrivacyLevel[] = [
  'PUBLIC_TO_EVERYONE',
  'MUTUAL_FOLLOW_FRIENDS',
  'SELF_ONLY',
  'FOLLOWER_OF_CREATOR',
];
const CREATOR_POST_BLOCK_ERROR_CODES = new Set([
  'spam_risk_too_many_posts',
  'spam_risk_user_banned_from_posting',
  'reached_active_user_cap',
]);
const CREATOR_POST_BLOCK_MESSAGES: Record<string, string> = {
  spam_risk_too_many_posts:
    'Sua conta TikTok atingiu temporariamente o limite de publicações. Tente novamente mais tarde.',
  spam_risk_user_banned_from_posting:
    'Sua conta TikTok está temporariamente impedida de publicar. Tente novamente mais tarde.',
  reached_active_user_cap:
    'O app atingiu o limite de criadores ativos nas últimas 24 horas. Tente novamente mais tarde.',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toStringValue = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const toBooleanValue = (value: unknown): boolean => value === true;

const toFiniteNumber = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const parsePrivacyLevelOptions = (value: unknown): TiktokPrivacyLevel[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is TiktokPrivacyLevel =>
      typeof item === 'string' && TIKTOK_PRIVACY_LEVELS.includes(item as TiktokPrivacyLevel),
  );
};

const getCanPostErrorMessage = (
  errorCode: string | null,
  apiMessage: string | null,
): string | null => {
  if (!errorCode || errorCode === 'ok') {
    return null;
  }

  return (
    CREATOR_POST_BLOCK_MESSAGES[errorCode] ??
    apiMessage ??
    'Não foi possível publicar no TikTok agora. Tente novamente mais tarde.'
  );
};

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

    const payload = isRecord(data) ? data : {};
    const errorPayload = isRecord(payload.error) ? payload.error : {};
    const creatorInfo = isRecord(payload.data) ? payload.data : {};
    const errorCodeValue = errorPayload.code;
    const errorMessageValue = errorPayload.message;
    const errorCode = typeof errorCodeValue === 'string' ? errorCodeValue : null;
    const apiErrorMessage =
      typeof errorMessageValue === 'string' ? errorMessageValue : null;
    const canPost = !errorCode || errorCode === 'ok';
    const isExpectedPostRestrictionError = Boolean(
      errorCode && CREATOR_POST_BLOCK_ERROR_CODES.has(errorCode),
    );

    if (!canPost && !isExpectedPostRestrictionError) {
      const errorMessage = apiErrorMessage ? `: ${apiErrorMessage}` : '.';
      throw new Error(`TikTok creator_info query failed (${errorCode ?? 'unknown'})${errorMessage}`);
    }

    return {
      creatorAvatarUrl: toStringValue(creatorInfo.creator_avatar_url),
      creatorUsername: toStringValue(creatorInfo.creator_username),
      creatorNickname: toStringValue(creatorInfo.creator_nickname),
      privacyLevelOptions: parsePrivacyLevelOptions(creatorInfo.privacy_level_options),
      commentDisabled: toBooleanValue(creatorInfo.comment_disabled),
      duetDisabled: toBooleanValue(creatorInfo.duet_disabled),
      stitchDisabled: toBooleanValue(creatorInfo.stitch_disabled),
      maxVideoPostDurationSec: toFiniteNumber(creatorInfo.max_video_post_duration_sec),
      canPost,
      canPostErrorCode: canPost ? null : errorCode,
      canPostErrorMessage: getCanPostErrorMessage(errorCode, apiErrorMessage),
    };
  }

  async initDirectPost(
    input: DirectPostInitInput,
  ): Promise<DirectPostInitOutput> {
    try {
      const { data } = await api.post(
        '/post/publish/video/init/',
        {
          post_info: {
            title: input.title,
            privacy_level: input.privacyLevel,
            disable_comment: input.disableComment,
            disable_duet: input.disableDuet,
            disable_stitch: input.disableStitch,
            brand_content_toggle: input.brandContentToggle,
            brand_organic_toggle: input.brandOrganicToggle,
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
    } catch (err) {
      console.error('[tiktok][initDirectPost] error:', err);
      if (axios.isAxiosError(err)) {
        console.error('[tiktok][initDirectPost][status]', err.response?.status);
        console.error('[tiktok][initDirectPost][data]', JSON.stringify(err.response?.data));
      }
      throw new Error((err as Error).message);
    }
  }

  async uploadDirectPostVideo(
    input: DirectPostUploadInput,
  ): Promise<DirectPostUploadOutput> {
    try {
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
    } catch (err) {
      console.error('[tiktok][uploadDirectPostVideo] error:', err);
      if (axios.isAxiosError(err)) {
        console.error('[tiktok][uploadDirectPostVideo][status]', err.response?.status);
        console.error('[tiktok][uploadDirectPostVideo][data]', JSON.stringify(err.response?.data));
      }
      throw new Error((err as Error).message);
    }
  }
}
