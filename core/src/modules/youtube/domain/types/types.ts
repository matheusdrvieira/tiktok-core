export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope?: string;
  tokenType?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
  scope?: string;
  tokenType?: string;
}

export interface UploadVideoRequest {
  userId: string;
  videoId?: string;
  videoPath: string;
  title: string;
}

export interface UploadVideoResponse {
  videoId: string;
}

export interface UploadVideoInput {
  accessToken: string;
  title: string;
  description: string;
  tags: string[];
  videoPath: string;
  videoSize: number;
  privacyStatus: 'private' | 'public' | 'unlisted';
}

export interface UploadVideoOutput {
  videoId: string;
}
