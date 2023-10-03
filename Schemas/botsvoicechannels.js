const mongoose = require('mongoose');

const botVoiceSchema = new mongoose.Schema({
  Guild: {
    type: String,
    required: true,
  },
  BotChannel: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('BotsVoiceChannels', botVoiceSchema);
