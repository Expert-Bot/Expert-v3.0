const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('unhide')
    .setDescription('unhide a text channel.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Text channel mention to unhide.')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  async execute(interaction, client) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("You don't have `ManageChannels` permission.")
      ], ephemeral: true
    });

    const channel = interaction.options.getChannel('channel');
    channel.edit({
      permissionOverwrites: [
        { type: 'role', id: interaction.guild.roles.everyone, allow: ['ViewChannel'] },
      ],
    });

    const embed = new EmbedBuilder()
      .setDescription(`The Channel ${channel.name} Has Been UnHidden Successfully`);

    await interaction.reply({
      embeds: [embed],
    });

  }

}