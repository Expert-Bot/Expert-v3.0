const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  PermissionFlagsBits,
} = require("discord.js");
const suggest = require("../../Schemas/Suggestion");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("enable-suggestion")
    .setDescription("Enables suggestion system in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((options) =>
      options.setName("channel").setDescription("Channel to send messages to")
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const Data = await suggest.findOne({ Guild: guild.id });
    if (Data) {
      Reply(interaction, ":x:", "This plugin is already enabled", true);
    }
    if (!Data) {
      const Channel = options.getChannel("channel");
      suggest.create({
        Guild: guild.id,
        Channel: Channel.id,
      });
      Reply(interaction, ":white_check_mark:", "Enabled this plugin");
    }
  },
};
