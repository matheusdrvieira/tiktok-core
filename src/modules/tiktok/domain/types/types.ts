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
  videoPath: string;
  title?: string;
  privacyLevel?: string;
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
}

export interface DirectPostResponse {
  publishId: string;
  uploadUrl: string;
}

export interface DirectPostInitInput {
  accessToken: string;
  title?: string;
  privacyLevel?: string;
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
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
