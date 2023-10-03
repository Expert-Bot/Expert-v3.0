const { model, Schema } = require('mongoose')
 
let welcomeschema = new Schema({
    Guild: String,
    Channel: String
})
 
module.exports = model('welcomeschema', welcomeschema);