import {
  CreatorInfoQueryInput,
  CreatorInfoQueryOutput,
  DirectPostInitInput,
  DirectPostInitOutput,
  DirectPostUploadInput,
  DirectPostUploadOutput,
  PublishStatusFetchInput,
  PublishStatusFetchOutput,
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
  abstract queryCreatorInfo(
    input: CreatorInfoQueryInput,
  ): Promise<CreatorInfoQueryOutput>;
  abstract initDirectPost(
    input: DirectPostInitInput,
  ): Promise<DirectPostInitOutput>;
  abstract uploadDirectPostVideo(
    input: DirectPostUploadInput,
  ): Promise<DirectPostUploadOutput>;
  abstract fetchPublishStatus(
    input: PublishStatusFetchInput,
  ): Promise<PublishStatusFetchOutput>;
}
