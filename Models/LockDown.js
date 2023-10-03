const { model, Schema } = require("mongoose");

let LockdownSchema = new Schema({
  GuildID: String,
  ChannelID: String,
  Time: String,
});

module.exports = model("Lockdown", LockdownSchema);