const { Schema, model } = require("mongoose");
const modLogsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  channelId: String,
});

module.exports = model("modSchema", modLogsSchema, "serverModlogs");