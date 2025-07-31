const request = require('supertest');
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Mock axios avant tests pour capturer les appels au processing_service
jest.mock('axios');

let app;

// Simule ton serveur Express minimal pour le test
beforeAll(() => {
  app = express();
  app.use(express.json());

  app.post('/request', async (req, res) => {
    const { action, page, pageSize, filters } = req.body;
    if (action !== 'getPaginatedItems') {
      return res.status(400).json({ error: 'Action inconnue' });
    }

    const uid = uuidv4();

    try {
      // Ici on mockera axios.post dans les tests, donc pas d'appel réel
      await axios.post('http://processing_service:4000/command', {
        uid,
        command: 'fetchPaginatedItems',
        page,
        pageSize,
        filters,
      });

      res.status(202).json({
        status: 'accepted',
        uid,
        message: 'Request received and processing started',
      });
    } catch {
      res.status(500).json({ error: 'Erreur lors de l’envoi à processing_service' });
    }
  });
});

describe('POST /request', () => {
  it('devrait accepter une requête valide et renvoyer un UID', async () => {
    // Mock axios.post pour simuler succès
    axios.post.mockResolvedValue({ data: { status: 'processing' } });

    const response = await request(app)
      .post('/request')
      .send({
        action: 'getPaginatedItems',
        page: 1,
        pageSize: 5,
        filters: { category: 'books' },
      });

    expect(response.statusCode).toBe(202);
    expect(response.body).toHaveProperty('uid');
    expect(response.body.status).toBe('accepted');
    expect(response.body.message).toMatch(/Request received/);

    // Vérifie qu'axios.post a été appelé avec les bons params
    expect(axios.post).toHaveBeenCalledWith(
      'http://processing_service:4000/command',
      expect.objectContaining({
        command: 'fetchPaginatedItems',
        page: 1,
        pageSize: 5,
        filters: { category: 'books' },
      })
    );
  });

  it('devrait rejeter une action inconnue', async () => {
    const response = await request(app)
      .post('/request')
      .send({ action: 'invalid', page: 1, pageSize: 5 });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Action inconnue');
  });

  it('devrait gérer une erreur axios', async () => {
    // Simule échec axios.post
    axios.post.mockRejectedValue(new Error('Network error'));

    const response = await request(app)
      .post('/request')
      .send({
        action: 'getPaginatedItems',
        page: 1,
        pageSize: 5,
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Erreur lors de l’envoi à processing_service');
  });
});