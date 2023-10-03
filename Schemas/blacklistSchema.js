const { model, Schema } = require("mongoose")

module.exports = model("blacklist", new Schema({
  userId: String,
  reason: String
}))