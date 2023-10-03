const mongoose = require("mongoose");

const UserVerifier = new mongoose.Schema({
  Guild: String,
  VerifierLogChannel: String,
});

module.exports = mongoose.model('UserVerifier', UserVerifier); 