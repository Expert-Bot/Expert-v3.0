const {model, Schema} = require('mongoose');
 
let commandSteal = new Schema({
    Guild: String,
    enabled: { type: Boolean, default: true }
});
 
module.exports = model("commandSteal", commandSteal);