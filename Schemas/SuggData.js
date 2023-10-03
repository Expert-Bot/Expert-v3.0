const { model, Schema } = require("mongoose");

let SuggData = new Schema({
  Guild: String,
  MessageID: String,
  User: String,
  Details: Array
});

module.exports = model("SuggData", SuggData);
