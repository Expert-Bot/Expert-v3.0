const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  is247Enabled: { type: Boolean, default: false },
});

module.exports = mongoose.model('Settings', settingsSchema);