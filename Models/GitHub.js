const { model, Schema } = require("mongoose");

let githubSchema = new Schema({
    Guild: String,
    MessageID: String,
    UserID: String,
    PEmail: String,
    GEmail: String,
});

module.exports = model("GitHub", githubSchema); 