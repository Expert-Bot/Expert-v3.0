require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(config);
module.exports = openai;