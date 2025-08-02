export interface RefreshToken {
  username: string;
  revoked: boolean;
  ip?: string | null;
  userAgent?: string | null;
  expiresAt: number;
  createdAt: number;
}