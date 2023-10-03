const {model, Schema} = require('mongoose');
 
let commandUnban = new Schema({
    Guild: String,
    enabled: { type: Boolean, default: true }
});
 
module.exports = model("commandUnban", commandUnban);