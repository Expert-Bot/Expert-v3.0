const { model, Schema } = require('mongoose')

let leaveSchema = new Schema({
  Guild: String,
  Channel: String,
})

module.exports = model("Leave", leaveSchema)