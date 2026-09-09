const mongoose = require('mongoose')

const videoSettingSchema = new mongoose.Schema({
  location: { type: String, required: true, unique: true }, // e.g. 'landing', 'mens', 'kids', 'mens-jeans'
  videoUrl: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('VideoSetting', videoSettingSchema)
