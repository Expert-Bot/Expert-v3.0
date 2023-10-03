const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ChatbotDB = require("../../Schemas/Chatbot");
const ChatbotThreadsDB = require("../../Schemas/ChatbotThreadData");
const { createTranscript } = require("discord-html-transcripts");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop-chat")
    .setDescription(
      "Use this command to stop the chat you currently have saved"
    )
    .addStringOption((options) =>
      options
        .setName("action")
        .setDescription("Select a action")
        .addChoices(
          { name: "Delete the Current Chat", value: "dcc" },
          {
            name: "Delete the Current Chat and Create a new one",
            value: "dccn",
          }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const { user, guild, options } = interaction;
    const Data = await ChatbotDB.findOne({ GuildID: guild.id }).catch(
      (err) => {}
    );
    const ThreadData = await ChatbotThreadsDB.findOne({
      GuildID: guild.id,
      UserID: user.id,
    }).catch((err) => {});
    if (!Data) {
      return Reply(
        interaction,
        ":x:",
        "Couldn't find any chatbot data for this guild",
        true
      );
    }
    if (!ThreadData) {
      return Reply(interaction, ":x:", "You haven't created a chat yet", true);
    }
    if (interaction.channel.id !== ThreadData.Thread)
      return Reply(
        interaction,
        ":x:",
        "You need to execute this command inside of your last chat(thread)",
        true
      );
    const action = await options.getString("action");
    try {
      switch (action) {
        case "dcc":
          const dataThread = await guild.channels.fetch(ThreadData.Thread);
          ChatbotThreadsDB.findOneAndDelete({
            UserID: user.id,
          }).then(async () => {
            await dataThread.delete();
          });
          const transcript = await createTranscript(dataThread, {
            limit: -1,
            returnBuffer: false,
            fileName: `${interaction.user.username}-Chat.html`,
          });

          const Embed1 = new EmbedBuilder()
            .setTitle("Deleted Chat")
            .setDescription(
              `Successfully deleted your chat, You can read your chat by downloading the transcript I sent to you`
            )
            .setColor("Random");
          user.send({ embeds: [Embed1], files: [transcript] });
          break;
        case "dccn":
          const dataThread1 = await guild.channels.fetch(ThreadData.Thread);
          const DataChannel = await guild.channels.fetch(Data.Channel);
          const thread = await DataChannel.threads.create({
            name: `${interaction.user.username}'s chat`,
            autoArchiveDuration: 60,
            reason: "Seprate thread for chatting with the bot",
          });
          const Embed3 = new EmbedBuilder()
            .setTitle("Deleted Chat")
            .setDescription(
              `Deleted the old chat and created a new chat, Default Type: **ChatGPT**`
            )
            .setColor("Random");
          thread.send({ embeds: [Embed3] });
          const newData = new ChatbotThreadsDB({
            GuildID: guild.id,
            UserID: user.id,
            Thread: thread.id,
            Type: "ChatGPT",
          });
          newData.save();
          const Embed2 = new EmbedBuilder()
            .setTitle("Deleted Chat")
            .setDescription(
              `Successfully deleted your chat and created a new one, You can read your chat by downloading the transcript I sent to you`
            )
            .setColor("Random");
          const transcript1 = await createTranscript(dataThread1, {
            limit: -1,
            returnBuffer: false,
            fileName: `${interaction.user.username}-Chat.html`,
          });
          user.send({ embeds: [Embed2], files: [transcript1] });
          ChatbotThreadsDB.findOneAndDelete({
            GuildID: guild.id,
            UserID: user.id,
          }).then(async () => {
            await dataThread1.delete();
          });
          break;
      }
      return;
    } catch (err) {
      if (err.code !== 50007) return console.log(err);
      else return;
    }
  },
};
