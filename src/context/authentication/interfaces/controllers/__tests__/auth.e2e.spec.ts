import request from 'supertest';
import app from '../../../../../app'; // ton express app
import { getDB } from '../../../infrastructure/db/leveldb';

// Utilitaire pour nettoyer la DB entre chaque test
beforeEach(async () => {
  const db = await getDB();
  await db.clear();
});

describe('Cycle authentification (register, login, refresh, logout)', () => {
  const username = 'testuser';
  const password = 'testpass';

  it('Register → Login → Access Protégé → Refresh → Logout', async () => {
    // Register
    let res = await request(app)
      .post('/register')
      .send({ username, password });
    expect(res.status).toBe(201);

    // Login récupère tokens
    res = await request(app)
      .post('/login')
      .send({ username, password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();

    const accessToken = res.body.accessToken;
    const cookies = res.headers['set-cookie'][0];

    // Accès à route protégée avec accessToken
    res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toBe(username);

    // Attendre expiration à la main si tu veux tester l'expiration (ici on simule direct le refresh)
    // Refresh du token (envoie cookie refreshToken)
    res = await request(app)
      .post('/auth/refresh')
      .set('Cookie', cookies);
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    const newAccessToken = res.body.accessToken;

    // Peut accéder à /protected avec le nouveau accessToken
    res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${newAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toBe(username);

    // Logout (révoque le refreshToken)
    res = await request(app)
      .post('/logout')
      .set('Cookie', cookies);
    expect(res.status).toBe(200);

    // Après logout, refresh doit échouer (token refresh invalidé)
    res = await request(app)
      .post('/auth/refresh')
      .set('Cookie', cookies);
    expect(res.status).toBe(401);
  });
});
