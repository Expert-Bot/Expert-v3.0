const { model, Schema } = require("mongoose");

let ChatbothreaData = new Schema({
  GuildID: String,
  UserID: String,
  Thread: String,
  Type: String,
});

module.exports = model("ChatbotThreadData", ChatbothreaData);
