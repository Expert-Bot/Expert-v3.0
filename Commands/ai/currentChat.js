const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ChatbotDB = require("../../Schemas/Chatbot");
const ChatbotThreadsDB = require("../../Schemas/ChatbotThreadData");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("current-chat")
    .setDescription("Shows the chat you created last time"),
  async execute(interaction) {
    const { user, guild } = interaction;
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
      return Reply(interaction, ":x:", `You don't have a chat`, true);
    }
    if (ThreadData) {
      const lastThread = await guild.channels.fetch(ThreadData.Thread);
      const Embed = new EmbedBuilder()
        .setTitle("Current Chat")
        .setDescription(
          `**Current Chat:** ${lastThread}\n**Type:** \`${ThreadData.Type}\``
        )
        .setFooter({ text: "ChatBot V4.0" })
        .setColor("Random");
      interaction.reply({ embeds: [Embed], ephemeral: true });
    }
  },
};
