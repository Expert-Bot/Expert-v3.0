const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  guildId: { type: String, require: true },
  userId: { type: String, require: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

module.exports = mongoose.model("User", userSchema);
