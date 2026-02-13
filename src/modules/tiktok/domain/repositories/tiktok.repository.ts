import {
  DirectPostInitInput,
  DirectPostInitOutput,
  DirectPostUploadInput,
  DirectPostUploadOutput,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenResponse,
} from '../types/types';

export abstract class TiktokRepository {
  abstract getAuthorizationUrl(state: string): string;
  abstract exchangeCodeForToken(code: string): Promise<TokenResponse>;
  abstract refreshToken(
    props: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse>;
  abstract initDirectPost(
    input: DirectPostInitInput,
  ): Promise<DirectPostInitOutput>;
  abstract uploadDirectPostVideo(
    input: DirectPostUploadInput,
  ): Promise<DirectPostUploadOutput>;
}
