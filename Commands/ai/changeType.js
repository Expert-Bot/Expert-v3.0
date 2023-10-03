const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ChatbotDB = require("../../Schemas/Chatbot");
const ChatbotThreadsDB = require("../../Schemas/ChatbotThreadData");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("change-type")
    .setDescription("Change the type of chat")
    .addStringOption((options) =>
      options
        .setName("type")
        .setDescription("Select the type of chatbot you want to chat with")
        .addChoices(
          { name: "BrainShop (Recommended)", value: "BrainShop" },
          {
            name: "ChatGPT (text-davinci-003)",
            value: "ChatGPT",
          },
          {
            name: "System (Not Recommended)",
            value: "System",
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
    const Type = await options.getString("type");
    if (!ThreadData) {
      return Reply(interaction, ":x:", `You don't have a chat`, true);
    }
    if (ThreadData) {
      const lastThread = await guild.channels.fetch(ThreadData.Thread);
      const Embed = new EmbedBuilder()
        .setTitle("Changed the Type")
        .setDescription(
          `**Current Chat:** ${lastThread}\n**Type:** \`${Type}\``
        )
        .setFooter({ text: "ChatBot V4.0" })
        .setColor("Random");
      interaction.reply({ embeds: [Embed], ephemeral: true }).then(async () => {
        ThreadData.Type = Type;
        ThreadData.save();
      });
    }
  },
};
