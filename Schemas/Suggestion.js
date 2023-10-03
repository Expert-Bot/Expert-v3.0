const { model, Schema } = require("mongoose");

let sugg = new Schema({
  Guild: String,
  Channel: String,
});

module.exports = model("sugg", sugg);
