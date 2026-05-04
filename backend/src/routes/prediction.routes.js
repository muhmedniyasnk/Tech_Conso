const express = require('express');
const axios = require('axios');
const router = express.Router();

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:6000';

router.post('/predict', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is required' });
  }

  try {
    const { data } = await axios.post(`${ML_URL}/predict`, req.body);
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 502;
    const message = err.response?.data || 'ML service unavailable';
    res.status(status).json({ error: message });
  }
});

module.exports = router;
