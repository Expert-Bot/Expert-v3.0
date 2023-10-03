const {model, Schema} = require('mongoose');
 
let commandMute = new Schema({
    Guild: String,
    enabled: { type: Boolean, default: true }
});
 
module.exports = model("commandMute", commandMute);