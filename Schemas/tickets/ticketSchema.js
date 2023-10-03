const { Schema, model } = require("mongoose");
const ticketOptionsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  channelId: String,
  categoryId: String,
  supportId: String,
  logsId: String
});

module.exports = model("ticketSchema", ticketOptionsSchema, "guildTicketSchema");
