const mongoose = require("mongoose");

const welcome = new mongoose.Schema({
  Guild: String,
  Role: String,
  BotRole: String,
});

module.exports = mongoose.model('Welcome', welcome); 