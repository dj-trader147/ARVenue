const mongoose = require('mongoose');

const promoSettingSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  code: { type: String, default: 'GRANDOPENING', uppercase: true, trim: true },
  percentage: { type: Number, default: 20, min: 0, max: 100 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PromoSetting', promoSettingSchema);
