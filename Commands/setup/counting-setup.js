const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const countingSchema = require('../../Schemas/countingSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counting-setup')
        .setDescription(`Setup a counting system for your guild`)
        .setDMPermission(false)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription(`Please indicate the channel where you would like the counting messages to be sent.`)
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addIntegerOption(option => option
            .setName('max-count')
            .setDescription(`The maxium number you want the server members to count up to (default 1000)`)
            .setRequired(false)
            .setMinValue(1)
        ),
    async execute(interaction) {

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({
            content: `The counting system cannot be set up because you do not have the necessary permissions to do so.`,
            ephemeral: true
        })

        const channel = interaction.options.getChannel('channel');
        const maxCount = interaction.options.getInteger('max-count') || 1000;

        countingSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (data) {
                return await interaction.reply({
                    content: 'You already have a counting system in place. To restart it, use the `/counting-disable` command.',
                    ephemeral: true
                });
            }

            countingSchema.create({
                Guild: interaction.guild.id,
                Channel: channel.id,
                Count: 0,
                MaxCount: maxCount
            });

            await interaction.reply({
                content: `The counting system has been successfully implemented within ${channel}. The maximum count is set to ${maxCount}.`,
                ephemeral: true
            });
        });
    }
}

// Created by: Razlar#4937