const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: '.',
  },
  twentyFourSeven: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Server', serverSchema);
