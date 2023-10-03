const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  voiceChannelId: { type: String },
  voiceConnectionData: { type: mongoose.Schema.Types.Mixed },
  lastActiveTime: { type: Date },
});

const GuildConfig = mongoose.model('GuildConfig', guildConfigSchema);

module.exports = GuildConfig;
