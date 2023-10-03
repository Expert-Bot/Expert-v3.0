const mongoose = require("mongoose");

const AntiAllowedLinks = new mongoose.Schema({
    Guild: String,
    Link: String,
});

module.exports = mongoose.model('AntiAllowedLinks', AntiAllowedLinks);