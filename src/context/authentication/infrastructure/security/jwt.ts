import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = 'access_secret_change_me';
const JWT_REFRESH_SECRET = 'refresh_secret_change_me';
const ACCESS_TOKEN_EXPIRE = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRE_SEC = 7 * 24 * 60 * 60; // 7 days in seconds

export function generateAccessToken(username: string): string {
  return jwt.sign({ username, iss: 'myapp', aud: 'myapp_users' }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
}

export function generateRefreshToken(username: string): string {
  return jwt.sign({ username, iss: 'myapp', aud: 'myapp_users' }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE_SEC });
}

export function verifyAccessToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as jwt.JwtPayload;
    if (!decoded.username || typeof decoded.username !== 'string') {
      return null;
    }
    return decoded.username;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload;
    if (!decoded.username || typeof decoded.username !== 'string') {
      return null;
    }
    return decoded.username;
  } catch {
    return null;
  }
}

export { REFRESH_TOKEN_EXPIRE_SEC };
