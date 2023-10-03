const {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const LockdownSchema = require("../../Models/LockDown");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Lift a lockdown from a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, channel } = interaction;

    const Embed = new EmbedBuilder();

    if (channel.permissionsFor(guild.id).has("SendMessages"))
      return interaction.reply({
        embeds: [
          Embed.setColor("Red").setDescription(
            "⛔ | This channel is not locked"
          ),
        ],
      });

    channel.permissionOverwrites.edit(guild.id, {
      SendMessages: null,
    });

    await LockdownSchema.deleteOne({ ChannelID: channel.id });

    interaction.reply({
      embeds: [
        Embed.setColor("Green").setDescription(
          "🔓 | Lockdown has been lifted."
        ),
      ],
    });
  },
};