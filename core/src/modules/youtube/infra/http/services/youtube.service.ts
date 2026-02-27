import axios from 'axios';
import { createReadStream } from 'node:fs';
import { env } from '../../../../../shared/config/env';
import { YoutubeRepository } from '../../../domain/repositories/youtube.repository';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenResponse,
  UploadVideoInput,
  UploadVideoOutput,
} from '../../../domain/types/types';

const googleOauthApi = axios.create({
  baseURL: 'https://oauth2.googleapis.com',
});

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com',
});

export class YoutubeService extends YoutubeRepository {
  private readonly authorizeEndpoint =
    'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly scope = 'https://www.googleapis.com/auth/youtube.upload';

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: env.YOUTUBE_CLIENT_ID,
      redirect_uri: env.YOUTUBE_REDIRECT_URI,
      response_type: 'code',
      scope: this.scope,
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state,
    });

    return `${this.authorizeEndpoint}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const { data } = await googleOauthApi.post(
      '/token',
      new URLSearchParams({
        client_id: env.YOUTUBE_CLIENT_ID,
        client_secret: env.YOUTUBE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: env.YOUTUBE_REDIRECT_URI,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    if (!data.refresh_token) {
      throw new Error('YouTube OAuth did not return refresh_token.');
    }

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      scope: data.scope,
      tokenType: data.token_type,
    };
  }

  async refreshToken(
    props: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const { data } = await googleOauthApi.post(
      '/token',
      new URLSearchParams({
        client_id: env.YOUTUBE_CLIENT_ID,
        client_secret: env.YOUTUBE_CLIENT_SECRET,
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
      scope: data.scope,
      tokenType: data.token_type,
    };
  }

  async uploadVideo(input: UploadVideoInput): Promise<UploadVideoOutput> {
    try {
      const uploadUrl = await this.initResumableUpload(input);
      const videoId = await this.uploadBinary(
        uploadUrl,
        input.videoPath,
        input.videoSize,
      );

      return { videoId };
    } catch (err) {
      console.log('[youtube][uploadVideo] error:', err);
      throw new Error((err as Error).message);
    }
  }

  private async initResumableUpload(input: UploadVideoInput): Promise<string> {
    try {
      const { headers } = await youtubeApi.post(
        '/upload/youtube/v3/videos',
        {
          snippet: {
            title: input.title,
            description: input.description,
            ...(input.tags.length > 0 ? { tags: input.tags } : {}),
          },
          status: {
            privacyStatus: input.privacyStatus,
            selfDeclaredMadeForKids: false,
          },
        },
        {
          params: {
            uploadType: 'resumable',
            part: 'snippet,status',
          },
          headers: {
            Authorization: `Bearer ${input.accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Upload-Content-Type': 'video/mp4',
            'X-Upload-Content-Length': String(input.videoSize),
          },
        },
      );

      const uploadUrlHeader = headers.location;
      const uploadUrl = Array.isArray(uploadUrlHeader)
        ? uploadUrlHeader[0]
        : uploadUrlHeader;

      if (typeof uploadUrl !== 'string' || uploadUrl.length === 0) {
        throw new Error('YouTube upload initialization missing upload URL.');
      }

      return uploadUrl;
    } catch (err) {
      console.log('[youtube][initResumableUpload] error:', err);
      throw new Error((err as Error).message);
    }
  }

  private async uploadBinary(
    uploadUrl: string,
    videoPath: string,
    contentLength: number,
  ): Promise<string> {
    try {
      const { data } = await axios.put(uploadUrl, createReadStream(videoPath), {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': String(contentLength),
        },
        responseType: 'json',
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 0,
      });

      const videoId = data?.id;

      if (typeof videoId !== 'string' || videoId.length === 0) {
        throw new Error('YouTube upload response missing video id.');
      }

      return videoId;
    } catch (err) {
      console.log('[youtube][uploadBinary] error:', err);
      throw new Error((err as Error).message);
    }
  }
}
