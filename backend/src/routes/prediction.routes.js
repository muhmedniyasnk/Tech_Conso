const express = require('express');
const router = express.Router();

router.post('/predict', (req, res) => {
  const { stage, quantity } = req.body;

  let labour = 0;
  let cement = 0;

  if (stage === 'Plastering') {
    labour = Math.ceil(quantity / 100);   // 1 labour per 100 sqft
    cement = Math.ceil(quantity / 50);    // 1 bag per 50 sqft
  }

  if (stage === 'Concrete') {
    labour = Math.ceil(quantity / 2);
    cement = Math.ceil(quantity * 7);
  }

  res.json({ labour, cement });
});

module.exports = router;