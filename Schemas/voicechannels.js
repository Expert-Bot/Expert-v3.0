const mongoose = require('mongoose');

const voiceSchema = new mongoose.Schema({
  Guild: {
    type: String,
    required: true,
  },
  TotalChannel: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('VoiceChannels', voiceSchema);
