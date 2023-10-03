const mongoose = require("mongoose");

const BlockedKeyWords = new mongoose.Schema({
  Guild: String,
  KeyWord: String,
});

module.exports = mongoose.model("BlockedKeyWords", BlockedKeyWords);
