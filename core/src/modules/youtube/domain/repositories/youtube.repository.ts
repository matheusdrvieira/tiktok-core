import {
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenResponse,
  UploadVideoInput,
  UploadVideoOutput,
} from '../types/types';

export abstract class YoutubeRepository {
  abstract getAuthorizationUrl(state: string): string;
  abstract exchangeCodeForToken(code: string): Promise<TokenResponse>;
  abstract refreshToken(
    props: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse>;
  abstract uploadVideo(input: UploadVideoInput): Promise<UploadVideoOutput>;
}
