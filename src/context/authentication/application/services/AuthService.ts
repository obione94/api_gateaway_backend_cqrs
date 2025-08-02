import crypto from 'crypto';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { RefreshTokenRepository } from '../../domain/repositories/RefreshTokenRepository';
import { hashPassword, comparePasswords } from '../../infrastructure/security/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, REFRESH_TOKEN_EXPIRE_SEC } from '../../infrastructure/security/jwt';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class AuthService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
  }

  async register(username: string, password: string): Promise<void> {
    const hashed = await hashPassword(password);
    await this.userRepository.create({ username, password: hashed });
  }

  async login(username: string, password: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) return null;

    const valid = await comparePasswords(password, user.password);
    if (!valid) return null;

    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);

    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRE_SEC;

    await this.refreshTokenRepository.store(refreshTokenHash, {
      username,
      revoked: false,
      ip: null,
      userAgent: null,
      expiresAt,
      createdAt: Date.now(),
    });

    return { accessToken, refreshToken };
  }

  async refresh(oldRefreshToken: string, ip: string | null, userAgent: string | null): Promise<{ accessToken: string; refreshToken: string } | null> {
    const usernameFromToken = verifyRefreshToken(oldRefreshToken);
    if (!usernameFromToken) return null;

    const oldTokenHash = hashToken(oldRefreshToken);
    const savedToken = await this.refreshTokenRepository.find(oldTokenHash);

    if (!savedToken || savedToken.revoked || savedToken.expiresAt < Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (savedToken.username !== usernameFromToken) {
      return null;
    }

    // Revoke old refresh token
    await this.refreshTokenRepository.revoke(oldTokenHash);

    // Issue new tokens
    const accessToken = generateAccessToken(usernameFromToken);
    const refreshToken = generateRefreshToken(usernameFromToken);
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRE_SEC;

    await this.refreshTokenRepository.store(refreshTokenHash, {
      username: usernameFromToken,
      revoked: false,
      ip,
      userAgent,
      expiresAt,
      createdAt: Date.now(),
    });

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.refreshTokenRepository.revoke(tokenHash);
  }
}
