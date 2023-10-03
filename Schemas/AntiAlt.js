const mongoose = require("mongoose");

const AntiAltDat = new mongoose.Schema({
    Guild: String,
    User: String,
});

module.exports = mongoose.model('AntiAltDat', AntiAltDat);