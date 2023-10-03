const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    Client,
    PermissionFlagsBits
} = require("discord.js");
const suggest = require("../../Schemas/Suggestion")
const Reply = require("../../Systems/Reply")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-suggestion")
    .setDescription("Disables suggestion system in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
   const Data = await suggest.findOne({ Guild: guild.id})
   if(!Data) {
    Reply(interaction, ":x:", "This plugin is already disabled")
   }

   if(Data) {
    suggest.findOneAndDelete({ Guild: guild.id})
    Reply(interaction, ":white_check_mark:", "Disabled this plugin")
   }
  },
};
