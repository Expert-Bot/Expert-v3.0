const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const ms = require("ms");
const client = require("../../index");

module.exports = {
  premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Fully completed giveaway system.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("start")
                .setDescription("🎉 Starts a giveaway.")
                .addStringOption(option =>
                    option.setName("length")
                        .setDescription("Enter the length of the giveaway.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("prize")
                        .setDescription("Set a prize to win.")
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName("winners")
                        .setDescription("Enter the number of winners (default is 1).")
                        .setRequired(false)
                )
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("Specify the channel where to send the giveaway. (default is current channel)")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("pause")
                .setDescription("️️⏸️ Pauses a giveaway.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify giveaway message-id.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("unpause")
                .setDescription("️️⏯️ Unpauses a giveaway.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify giveaway message-id.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("end")
                .setDescription("️️⏹️ Ends a giveaway.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify giveaway message-id.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("reroll")
                .setDescription("️️🔃 Selects a new giveaway winner.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify giveaway message-id.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("delete")
                .setDescription("️️🚮 Deletes the giveaway.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify giveaway message-id.")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const { options, channel, guildId } = interaction;

        const sub = options.getSubcommand();

        const errorEmbed = new EmbedBuilder().setColor("Red");
        const successEmbed = new EmbedBuilder().setColor("Green");

        if (sub === "start") {
            const gchannel = options.getChannel("channel") || channel;
            const duration = ms(options.getString("length"));
            const winnerCount = options.getInteger("winners") || 1;
            const prize = options.getString("prize");

            if (isNaN(duration)) {
                errorEmbed.setDescription("Enter the corredct giveaway length format! `1d, 1h, 1m, 1s`!");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            }

            return client.giveawaysManager.start(gchannel, {
                duration: duration,
                winnerCount,
                prize,
                messages: client.giveawayConfig.messages
            }).then(async () => {
                if (client.giveawayConfig.giveawayManager.everyoneMention) {
                    const msg = await gchannel.send("@everyone");
                    msg.delete();
                }
                successEmbed.setDescription(`Giveaway started in ${gchannel}`);
                return interaction.reply({ embeds: [successEmbed], ephemeral: true });
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            });
        }

        const messageid = options.getString("message-id");
        const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === guildId && g.messageId === messageid);
        if (!giveaway) {
            errorEmbed.setDescription(`Giveaway with ID ${messageid} was not found in the database!`);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (sub === "pause") {
            if (giveaway.isPaused) {
                errorEmbed.setDescription("This giveaway is already paused!");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            await client.giveawaysManager.pause(messageid, {
                content: client.giveawayConfig.messages.paused,
                infiniteDurationText: client.giveawayConfig.messages.infiniteDurationText,
            }).then(() => {
                successEmbed.setDescription('⏸️ The giveaway has been paused!').setColor("Blue");
                return interaction.reply({ embeds: [successEmbed], ephemeral: true });
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            });
        }

        if (sub === "unpause") {
            client.giveawaysManager.unpause(messageid).then(() => {
                successEmbed.setDescription('▶️ The giveaway has been unpaused!').setColor("Blue");
                return interaction.reply({ embeds: [successEmbed], ephemeral: true });
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            });
        }

        if (sub === "end") {
            client.giveawaysManager.end(messageid).then(() => {
                successEmbed.setDescription('▶️ The giveaway has been stopped!').setColor("Blue");
                return interaction.reply({ embeds: [successEmbed], ephemeral: true });
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            });
        }

        if (sub === "reroll") {
            await client.giveawaysManager.reroll(messageid, {
                messages: {
                    congrat: client.giveawayConfig.messages.congrat,
                    error: client.giveawayConfig.messages.error
                }
            }).then(() => {
                successEmbed.setDescription('🎉 The giveaway has a new winner!').setColor("Gold");
                return interaction.reply({ embeds: [successEmbed], ephemeral: true });
            }).catch((err) => {
                errorEmbed.setDescription(`Error \n\`${err}\``).setColor("Red");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            });
        }

        if (sub === "delete") {
            await client.giveawaysManager.delete(messageid).then(() => {
                successEmbed.setDescription('🚮 The giveaway has been deleted!').setColor("Blue");
                return interaction.reply({ embeds: [successEmbed], ephemeral: true });
            }).catch((err) => {
                errorEmbed.setDescription(`Error \n\`${err}\``).setColor("Red");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            });
        }
    }
}