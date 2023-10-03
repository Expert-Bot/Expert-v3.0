const mongoose = require('mongoose');

const duelsSchema = new mongoose.Schema({
    Guild: { type: String, required: true },
    Channel: { type: String, required: true },
    Category: { type: String, required: true },
    Logs: { type: String, required: true },
    Transcript: { type: String, required: true },
    Role: { type: String, required: true }
});

module.exports = mongoose.model('Duels', duelsSchema);
