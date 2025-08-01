const express = require('express');
const app = express();

const healthzRoutes = require('./routes/healthz');

app.use('/healthz', healthzRoutes);

module.exports = app;
