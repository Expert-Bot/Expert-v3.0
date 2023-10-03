const { Schema, model } = require("mongoose");

const guessSchema = new Schema({

    guildId: { type: String, required: true},

    channelId: { type: String, required: true},

    number: { type: Number, required: true}

});

 

module.exports = model("guess", guessSchema, "guessInfo")