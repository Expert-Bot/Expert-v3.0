const {model, Schema} = require('mongoose');
 
let commandClear = new Schema({
    Guild: String,
    enabled: { type: Boolean, default: true }
});
 
module.exports = model("commandClear", commandClear);