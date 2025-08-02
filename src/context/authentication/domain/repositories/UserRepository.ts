import { getDB } from '../../infrastructure/db/leveldb';
import { User } from '../entities/User';

export class UserRepository {
  async getByUsername(username: string): Promise<User | null> {
    try {
      const db = await getDB();
      const user = await db.get(`user:${username}`) as User;
      return user;
    } catch (err) {
      // Not found
      return null;
    }
  }

  async create(user: User): Promise<void> {
    const db = await getDB();
    return db.put(`user:${user.username}`, user);
  }
}