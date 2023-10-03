const { model, Schema } = require("mongoose");

let githubSetupSchema = new Schema({
    Guild: String,
    Channel: String,
    Enabled: Boolean
});

module.exports = model("GitHubSetup", githubSetupSchema); 