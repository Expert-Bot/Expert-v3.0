const mongoose = require("mongoose");

const AntiUnverifiedBot = new mongoose.Schema({
    Guild: String,
    Bot: String,
});

module.exports = mongoose.model('AntiUnverifiedBot', AntiUnverifiedBot);