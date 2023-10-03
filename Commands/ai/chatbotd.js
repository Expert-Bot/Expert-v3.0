const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const ChatbotDB = require("../../Schemas/Chatbot");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-chatbot")
    .setDescription("Disable chatbot system for your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const { guild } = interaction;
    const Data = await ChatbotDB.findOne({ GuildID: guild.id });
    if (!Data) {
      return Reply(interaction, ":x:", "This plugin is already disabled");
    }
    if (Data) {
      await ChatbotDB.findOneAndDelete({ GuildID: guild.id });
      return Reply(
        interaction,
        ":white_check_mark:",
        "This plugin has been disabled"
      );
    }
  },
};
