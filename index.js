// api_gateway/index.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const app = express();
const cors = require('cors');
const PORT = 3000;
const backend2Url = 'http://processing_service:4000/command';
const corsOptions = {
  origin: 'https://obione94.github.io/flutterWeb',
  credential:true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/healthz', async (req, res) => {
   // Répondre immédiatement au front avec l'UID
    res.status(202).json({
      status: 'accepted',
      message: 'alive',
    });
});

app.post('/request', async (req, res) => {
  const { action, page, pageSize, filters } = req.body;
  if (action !== 'getPaginatedItems') {
    return res.status(400).json({ error: 'Action inconnue' });
  }

  const uid = uuidv4();

  // On envoie la commande à Backend2 avec l'UID
  try {
    await axios.post(backend2Url, {
      uid,
      command: 'fetchPaginatedItems',
      page,
      pageSize,
      filters,
    });

    // Répondre immédiatement au front avec l'UID
    res.status(202).json({
      status: 'accepted',
      uid,
      message: 'Request received and processing started',
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’envoi à processing_service' });
  }
});

app.listen(PORT, () => {
  console.log(`api_gateway écoute sur le port ${PORT}`);
});
