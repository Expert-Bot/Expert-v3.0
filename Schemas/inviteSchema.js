const {model, Schema} = require('mongoose');
 
let inviteSchema = new Schema({
    Guild: String,
    Channel: String,
});
 
module.exports = model("invite", inviteSchema);