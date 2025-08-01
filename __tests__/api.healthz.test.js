const request = require('supertest');
const app = require('../app');

describe('GET /healthz', () => {
  it('should respond with status 202 and proper JSON', async () => {
    const res = await request(app)
      .get('/healthz')
      .set('Origin', 'https://obione94.github.io/flutterWeb'); // Simule l'origine CORS

    expect(res.statusCode).toBe(202);
    expect(res.body).toEqual({
      status: 'accepted',
      message: 'born to be Health'
    });
  });
});