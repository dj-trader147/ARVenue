const express = require('express');
const router = express.Router();
const PromoSetting = require('../models/PromoSetting');

// GET Promo Settings for Storefront & Admin
router.get('/promo', async (req, res) => {
  try {
    let settings = await PromoSetting.findOne();
    if (!settings) {
      settings = await PromoSetting.create({ enabled: true, code: 'GRANDOPENING', percentage: 20 });
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST / UPDATE Promo Settings from Admin Panel
router.post('/promo', async (req, res) => {
  try {
    const { enabled, code, percentage } = req.body;
    let settings = await PromoSetting.findOne();
    if (!settings) {
      settings = new PromoSetting();
    }
    if (enabled !== undefined) settings.enabled = enabled;
    if (code) settings.code = String(code).trim().toUpperCase();
    if (percentage !== undefined) settings.percentage = Number(percentage);
    settings.updatedAt = Date.now();
    
    await settings.save();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
