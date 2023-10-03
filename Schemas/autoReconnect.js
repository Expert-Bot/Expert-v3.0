const mongoose = require('mongoose');

const autoReconnectSchema = new mongoose.Schema({
  Guild: {
    type: String,
    required: true,
  },
  TextId: {
    type: String,
    required: true,
  },
  VoiceId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('autoReconnect', autoReconnectSchema);
