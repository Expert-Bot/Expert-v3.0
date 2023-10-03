const { model, Schema } = require("mongoose");

let Suggestion = new Schema({
    GuildID: String,
    MessageID: String,
    Details: Array,
    AcceptedReacted: Array,
    DeclinedReacted: Array,
});

module.exports = model("Suggestion", Suggestion);