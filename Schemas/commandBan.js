const {model, Schema} = require('mongoose');
 
let commandBan = new Schema({
    Guild: String,
    enabled: { type: Boolean, default: true }
});
 
module.exports = model("commandBan", commandBan);