const express = require('express');
const router = express.Router();
const healthzController = require('../controllers/healthzController');

router.get('/', healthzController.checkHealth);

module.exports = router;