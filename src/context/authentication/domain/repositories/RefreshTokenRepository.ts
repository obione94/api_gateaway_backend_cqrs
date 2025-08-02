import { getDB } from '../../infrastructure/db/leveldb';
import { RefreshToken } from '../entities/RefreshToken';

export class RefreshTokenRepository {
  async store(tokenHash: string, data: RefreshToken): Promise<void> {
    const db = await getDB();
    await db.put(`refresh:${tokenHash}`, data);
  }

  async find(tokenHash: string): Promise<RefreshToken | null> {
    try {
      const db = await getDB();
      const tokenData = await db.get(`refresh:${tokenHash}`) as RefreshToken;
      return tokenData;
    } catch (err) {
      return null;
    }
  }

  async revoke(tokenHash: string): Promise<void> {
    const tokenData = await this.find(tokenHash);
    if (tokenData) {
      tokenData.revoked = true;
      await this.store(tokenHash, tokenData);
    }
  }
}
