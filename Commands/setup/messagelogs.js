
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionFlagsBits } = require('discord.js');
const messageLogSchema = require('../../Schemas/messageLogSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat-logs')
    .setDescription("Set the message log channel for the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addChannelOption(option => option.setName('channel').setDescription('Specify the channel to be the message log channel.').setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        console.log('Received channel type:', channel.type);
      
        if (!channel) {
          return await interaction.reply({ content: "Please select a valid text channel.", ephemeral: true });
        }

    await messageLogSchema.findOneAndUpdate(
      { Guild: interaction.guild.id },
      { Guild: interaction.guild.id, Channel: channel.id },
      { upsert: true }
    );

    await interaction.reply({ content: `Message log channel has been set to ${channel}.`, ephemeral: true });
  },
};