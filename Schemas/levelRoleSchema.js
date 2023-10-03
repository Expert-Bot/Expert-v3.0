const { model, Schema } = require(`mongoose`);
let levelRoleSchema = new Schema({
    GuildID: String,
    LevelRoleData: Array
})

module.exports = model(`levelRoleSchema_x`, levelRoleSchema);