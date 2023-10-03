const mongoose = require("mongoose");

const AntiAllowedChannelLinks = new mongoose.Schema({
    Guild: String,
    Channel: String,
});

module.exports = mongoose.model('AntiAllowedChannelLinks', AntiAllowedChannelLinks);