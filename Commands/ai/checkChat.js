const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ChatbotDB = require("../../Schemas/Chatbot");
const ChatbotThreadsDB = require("../../Schemas/ChatbotThreadData");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-chat")
    .setDescription("Check a user's chat")
    .addUserOption((options) =>
      options
        .setName("user")
        .setDescription("Mention a user to check it latest chat")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { guild, options } = interaction;
    const Data = await ChatbotDB.findOne({ GuildID: guild.id }).catch(
      (err) => {}
    );
    const Target = await options.getUser("user");
    const ThreadData = await ChatbotThreadsDB.fin0dOne({
      GuildID: guild.id,
      UserID: Target.id,
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
      return Reply(interaction, ":x:", `This user doesn't have a chat`, true);
    }
    if (ThreadData) {
      const lastThread = await guild.channels.fetch(ThreadData.Thread);
      const Embed = new EmbedBuilder()
        .setTitle(`Current Chat of ${Target.username}`)
        .setDescription(
          `**Current Chat:** ${lastThread}\n**Type:** \`${ThreadData.Type}\``
        )
        .setFooter({ text: "ChatBot V4.0" })
        .setColor("Random");
      interaction.reply({ embeds: [Embed], ephemeral: true });
    }
  },
};
