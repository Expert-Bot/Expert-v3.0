const { model, Schema } = require('mongoose');
 
let duelsSchema = new Schema({
    Guild: String,
    MemberOneID: String,
    MemberTwoID: String,
    UserID: String,
    MemberID: String,
    MatchID: String,
    Role: String,
    Channel: String,
    Category: String,
    Logs: String,
    Transcript: String
})
 
module.exports = model('duelsSchema', duelsSchema);