const mongoose = require("mongoose");

const Userautomod = new mongoose.Schema({
  Guild: String,
  User: String,
  InfractionPoints: Number,
});

module.exports = mongoose.model('Userautomod', Userautomod);