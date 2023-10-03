const { model, Schema } = require("mongoose");

let SuggestChannel = new Schema({
    GuildID: String,
    ChannelID: String,
    Reactions: Number,
    Enabled: Boolean,
});

module.exports = model("SuggestChannel", SuggestChannel);