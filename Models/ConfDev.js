const { model, Schema } = require("mongoose");

let Dev = new Schema({
  Guild: String,
  Status: Boolean,
});

module.exports = model("Dev", Dev);
