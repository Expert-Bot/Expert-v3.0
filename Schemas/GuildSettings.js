// GuildSettings.js
const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: String,
  prefix: String,
  musicMode: String,
});

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
