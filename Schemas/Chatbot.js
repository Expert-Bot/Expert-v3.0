const { model, Schema } = require("mongoose");

let ChatbotData = new Schema({
  GuildID: String,
  Channel: String,
  Mod: String,
  Date: Number,
});

module.exports = model("ChatbotData", ChatbotData);
