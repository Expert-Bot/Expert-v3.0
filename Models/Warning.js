const { Schema, model } = require("mongoose");

let warningSchema = new Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    Content: Array
});

module.exports = model("WarningSchema", warningSchema);