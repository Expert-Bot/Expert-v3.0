const axios = require("axios");
const ChatbotThreadData = require("../../Schemas/ChatbotThreadData");
const ChatbotData = require("../../Schemas/Chatbot");
module.exports = {
  name: "messageCreate",

  async execute(message) {
    var Data = await ChatbotThreadData.findOne({ UserID: message.author.id });
    var ChatbotDatas = await ChatbotData.findOne({ GuildID: message.guild.id });
    if (message.author.bot || !message.guild) return;
    if (!ChatbotDatas) return;

    try {
      if (Data) {
        if (message.channel.id !== Data.Thread) return;
        if (Data.Type == "BrainShop") {
          const res = await axios.get(
            `
            http://api.brainshop.ai/get?bid=172277&key=ZEEuyFpmJH56JOAE&uid=1&msg=${encodeURIComponent(
              message.content
            )}`
          );
          if (res.data.cnt === undefined || res.data.cnt === null) {
            message.reply("I am sorry, Can you repeat it again?");
          } else {
            await message.reply({
              content: `${res.data.cnt}`,
            });
            return;
          }
        }
        if (Data.Type == "ChatGPT") {
          const { Configuration, OpenAIApi } = require("openai");
          const configuration = new Configuration({
            organization: process.env.OPENAI_ORG,
            apiKey: "Replace_with_api_key",
          });
          const openai = new OpenAIApi(configuration);

          const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Hey give me a response me for this : ${message.content}`,
            temperature: 0.5,
            max_tokens: 200,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
          });

          if (gptResponse === undefined || gptResponse === null) {
            message.reply("I am sorry, Can you repeat it again?");
            return;
          } else {
            message.reply(`${gptResponse.data.choices[0].text}`);
            return;
          }
        }
        if (Data.Type == "System") {
          const natural = require("natural");
          const kmeans = require("node-kmeans");
          const { dataset, responseMap } = require("../../Systems/Dataset");
          // Convert dataset to array of arrays of numbers using TF-IDF
          const tfidf = new natural.TfIdf();
          dataset.forEach((item) => {
            tfidf.addDocument(item);
          });
          const datasetNumeric = tfidf.documents.map((doc) => {
            return tfidf.listTerms(doc).map((item) => item.tfidf);
          });
          // Clustering
          const k = 3; // Number of clusters
          kmeans.clusterize(datasetNumeric, { k }, (err, res) => {
            if (err) console.error(err);
            else {
              // Find the cluster index of the input message
              const stringSimilarity = require("string-similarity");

              // Find the closest matching string in the dataset array
              const match = stringSimilarity.findBestMatch(
                message.content,
                dataset
              );
              const inputIndex = match.bestMatchIndex;
              if (inputIndex == -1) {
                console.log("Response was not found in the dataset");
                message.reply("I am sorry, I didn't get it");
              }
              if (inputIndex > -1) {
                console.log(res[0].clusterInd); // Access the clusterInd property correctly
                console.log(inputIndex);
                const clusterIndex = res[0].clusterInd[inputIndex]; // Access the clusterInd property correctly
                console.log(clusterIndex);
                // Lookup the appropriate response in the responseMap

                const output1 = responseMap[clusterIndex];
                const response =
                  output1[Math.floor(Math.random() * output1.length)];
                if (response === undefined || response === null) {
                  return message.reply("I am sorry, Can you repeat it again?");
                } else {
                  return message.reply(response);
                }
              }
            }
          });
        }
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
