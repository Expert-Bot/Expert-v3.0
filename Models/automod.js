const mongoose = require("mongoose");

const automod = new mongoose.Schema({
  Guild: String,
  LogChannel: String,
  AntiUnverifiedBot: Boolean,
  AntiSwear: Boolean,
  AntiScam: Boolean,
  AntiLink: Boolean,
  AntiPing: Boolean,
  AntiAltAccount: Boolean,
});

module.exports = mongoose.model('automod', automod);

console.log("automod connected")