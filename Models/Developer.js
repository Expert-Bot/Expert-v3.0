const { model, Schema } = require("mongoose");

let DevApp = new Schema({
    Guild: String,
    User: String,
    MessageID: String,
});

module.exports = model("DevApp", DevApp); 