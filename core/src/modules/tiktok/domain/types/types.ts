export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  openId: string;
  refreshToken: string;
  refreshExpiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  openId?: string;
}

export interface DirectPostRequest {
  userId: string;
  videoId?: string;
  videoPath: string;
  title: string;
}

export interface DirectPostResponse {
  publishId: string;
  uploadUrl: string;
}

export interface DirectPostInitInput {
  accessToken: string;
  title: string;
  videoSize: number;
}

export interface DirectPostInitOutput {
  publishId: string;
  uploadUrl: string;
}

export interface DirectPostUploadInput {
  uploadUrl: string;
  videoPath: string;
  contentLength: number;
}

export interface DirectPostUploadOutput {
  publishId: string;
  uploadUrl: string;
}

export interface CreatorInfoQueryInput {
  accessToken: string;
}

export type TiktokPrivacyLevel =
  | 'PUBLIC_TO_EVERYONE'
  | 'MUTUAL_FOLLOW_FRIENDS'
  | 'SELF_ONLY'
  | 'FOLLOWER_OF_CREATOR';

export interface CreatorInfoQueryOutput {
  creatorAvatarUrl: string;
  creatorUsername: string;
  creatorNickname: string;
  privacyLevelOptions: TiktokPrivacyLevel[];
  commentDisabled: boolean;
  duetDisabled: boolean;
  stitchDisabled: boolean;
  maxVideoPostDurationSec: number;
}
