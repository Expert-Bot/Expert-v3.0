const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const GitHubSchema = require("../Models/GitHubSetup");
const GitHubUser = require("../Models/GitHub");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("github")
        .setDescription("Request access to the private github!")
        .setDMPermission(false),
    async execute(interaction) {
        const { member, guildId } = interaction;
        GitHubSchema.findOne({ Guild: guildId }, async (err, data) => {

            const customer = member.roles.cache.has("1032785824686817298");

            const embed = new EmbedBuilder();

            if (!customer) {
                embed.setColor("Red")
                    .setTimestamp()
                    .setDescription("You are not a registered patreon. Please link your `discord account` with Patreon.")
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (!data) {
                const embed = new EmbedBuilder()
                    .setDescription("The github system is not set-up yet!")
                    .setColor("#235ee7")
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (data.Enabled == false) {
                const embed = new EmbedBuilder()
                    .setDescription("Sad! The github system is currently disabled!")
                    .setColor("#235ee7")
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const modal = new ModalBuilder()
                .setCustomId('githubModal')
                .setTitle("Request GitHub Access")

            const modalDescription = new TextInputBuilder()
                .setCustomId('modalGithHubDescription')
                .setLabel("Patreon Email")
                .setPlaceholder("Email linked to patreon: example@gmail.com")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const modalDescription2 = new TextInputBuilder()
                .setCustomId('modalGithHubDescription2')
                .setLabel("Github Email")
                .setPlaceholder("Email linked to github: example@gmail.com")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(modalDescription);
            const secondActionRow = new ActionRowBuilder().addComponents(modalDescription2);

            modal.addComponents(
                firstActionRow,
                secondActionRow
            );

            await interaction.showModal(modal);
        });
    }
}