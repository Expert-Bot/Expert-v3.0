const {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const LockdownSchema = require("../../Models/LockDown");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lockdown this channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Expire date for this lockdown (1m, 1h, 1d).")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Provide a reason for this lockdown.")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const { guild, channel, options } = interaction;

    const Reason = options.getString("reason") || "No specified reason";

    const Embed = new EmbedBuilder();

    if (!channel.permissionsFor(guild.id).has("SendMessages"))
      return interaction.reply({
        embeds: [
          Embed.setColor("Red").setDescription(
            "⛔ | This channel is already locked."
          ),
        ],
        ephemeral: true,
      });

    channel.permissionOverwrites.edit(guild.id, {
      SendMessages: false,
    });

    interaction.reply({
      embeds: [
        Embed.setColor("Red").setDescription(
          `🔒 | This channel is now under lockdown for: ${Reason}`
        ),
      ],
    });
    const Time = options.getString("time");
    if (Time) {
      const ExpireDate = Date.now() + ms(Time);
      LockdownSchema.create({
        GuildID: guild.id,
        ChannelID: channel.id,
        Time: ExpireDate,
      });

      setTimeout(async () => {
        channel.permissionOverwrites.edit(guild.id, {
          SendMessages: null,
        });

        interaction
          .editReply({
            embeds: [
              Embed.setDescription(
                "🔓 | The lockdown has been lifted"
              ).setColor("Green"),
            ],
          })
          .catch(() => { });

        await LockdownSchema.deleteOne({ ChannelID: channel.id });
      }, ms(Time));
    }
  },
};