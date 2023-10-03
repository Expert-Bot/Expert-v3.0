
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-all')
        .setDescription('Gives all members a specified role')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to give to all members')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Check if user has the MANAGE_ROLES permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.MANAGE_ROLES)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('You do not have permission to use this command.');

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Get the role option from the user's input
        const role = interaction.options.getRole('role');

        // Get all members in the server
        const members = await interaction.guild.members.fetch();

        // Give the role to all members
        members.forEach(member => {
            if (!member.roles.cache.has(role.id)) {
                member.roles.add(role);
            }
        });

        // Send a success message
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setDescription(`Successfully gave the "${role.name}" role to all members.`);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};