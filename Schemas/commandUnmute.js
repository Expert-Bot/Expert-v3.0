const {model, Schema} = require('mongoose');
 
let commandUnmute = new Schema({
    Guild: String,
    enabled: { type: Boolean, default: true }
});
 
module.exports = model("commandUnmute", commandUnmute);