const mongoose = require("mongoose");

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String },
  backstory: { type: String, default: "Bard can you answer this: {question}" },
});

const GuildSettings = mongoose.model("GuildSettings", guildSettingsSchema);

module.exports = GuildSettings;