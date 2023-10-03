const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
const githubSetup = require("../Models/GitHubSetup");

module.exports = {
    moderatorOnly: true,
    data: new SlashCommandBuilder()
        .setName("git")
        .setDescription("Set up your suggesting channel for the suggestions.")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("setup")
                .setDescription("Setup the suggestion system.")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("Channel for suggesting messages.")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("configure")
                .setDescription("Configure the suggestion system.")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("Channel for suggesting messages.")
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addStringOption(option =>
                    option.setName("toggle")
                        .setDescription(`Do you want to enable/disable the github applications?`)
                        .addChoices(
                            { name: "Enable", value: "enable" },
                            { name: "Disable", value: "disable" }
                        )
                )
        ),

    async execute(interaction) {
        const { channel, guildId, options } = interaction;

        const subcommand = options.getSubcommand();

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTimestamp();

        switch (subcommand) {
            case "setup":
                const githubChannel = options.getChannel("channel") || channel;

                githubSetup.findOne({ Guild: guildId }, async (err, data) => {
                    if (data) {
                        embed.setDescription("The github system is already set up. Please use `/git configure` to make any changes.")
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {
                        await githubSetup.create({
                            Guild: guildId,
                            Channel: githubChannel.id,
                            Enabled: true
                        });

                        embed.setDescription("Data was succesfully sent to the database.");
                    }

                    if (err) {
                        embed.setDescription("Something went wrong. Please contact the developers.")
                            .setColor("Red")
                            .setTimestamp();
                    }

                    return interaction.reply({ embeds: [embed], ephemeral: true });
                });
                break;
            case "configure":
                const newChannel = options.getChannel("channel") || channel;
                const toggler = options.getString("toggle");

                githubSetup.findOne({ Guild: guildId }, async (err, data) => {

                    if (!data)
                        return interaction.reply({ content: "The github system is not set up yet. Use `/git setup` to set it up.", ephemeral: true });

                    data.Channel = newChannel.id;

                    switch (toggler) {
                        case "enable":
                            data.Enabled = true;
                            break;
                        case "disable":
                            data.Enabled = false;
                            break;
                    }
                    data.save();

                    if (err) {
                        embed.setDescription("Something went wrong. Please contact the developers.")
                            .setColor("Red")
                            .setTimestamp();
                    }

                    embed.setDescription("Succesfully updated the configuration.");

                    return interaction.reply({ embeds: [embed], ephemeral: true });
                });
                break;
        }
    }
}