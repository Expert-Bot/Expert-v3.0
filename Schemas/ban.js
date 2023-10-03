const { model, Schema } = require('mongoose');
 
let bans = new Schema ({
    Guild: String,
    User: String,
    Time: Number
})
 
module.exports = model('bans', bans);