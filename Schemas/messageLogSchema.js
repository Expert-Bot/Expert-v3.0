
const { model, Schema } = require('mongoose');

const messageLogSchema = new Schema({
  Guild: String,
  Channel: String
});

module.exports = model('MessageLog', messageLogSchema);