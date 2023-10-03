const { Schema, model } = require("mongoose");
const userTicketOptions = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String, 
  ticketId: String,
  claimed: Boolean,
  claimer: String,
  closed: Boolean,
  closer: String,
  creatorId: String,
});

module.exports = model("userTickets", userTicketOptions, "userTicketSchema");
