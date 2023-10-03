const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const warningSchema = require("../../Models/Warning");

module.exports = {
    moderatorOnly: false,
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Warn users who do not behave according to our community rules.")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("Add a warning to a user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Select a user.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("reason")
                        .setDescription("Provide a reason.")
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option.setName("evidence")
                        .setDescription("Provide evidence.")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("check")
                .setDescription("Check warnings of a user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Select a user.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("Remove a specific warning from a user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Select a user.")
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName("id")
                        .setDescription("Provide the warning's id.")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("clear")
                .setDescription("Clear all warnings from a user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Select a user.")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const { options, guildId, user, member } = interaction;

        const sub = options.getSubcommand(["add", "check", "remove", "clear"]);
        const target = options.getUser("target");
        const reason = options.getString("reason") || "No reason provided.";
        const evidence = options.getString("evidence") || "None provided.";
        const warnId = options.getInteger("id") - 1;
        const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

        const userTag = `${target.username}#${target.discriminator}`;

        const embed = new EmbedBuilder();

        switch (sub) {
            case "add":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (!data) {
                        data = new warningSchema({
                            GuildID: guildId,
                            UserID: target.id,
                            UserTag: userTag,
                            Content: [
                                {
                                    ExecuterId: user.id,
                                    ExecuterTag: user.tag,
                                    Reason: reason,
                                    Evidence: evidence,
                                    Date: warnDate
                                }
                            ],
                        });
                    } else {
                        const warnContent = {
                            ExecuterId: user.id,
                            ExecuterTag: user.tag,
                            Reason: reason,
                            Evidence: evidence,
                            Date: warnDate
                        }
                        data.Content.push(warnContent);
                    }
                    data.save();

                    if (Object.keys(data.Content).length == 3) {
                        try {
                            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                                embed.setColor("Blue")
                                    .setDescription(`I would normally kick ${target} because he reached 3 warns, but he's higher than me :(`)
                                    .setFooter({ text: target.tag, iconURL: target.displayAvatarURL({ dynamic: true }) })
                                    .setTimestamp();

                                return interaction.reply({ embeds: [embed] });
                            } else {
                                await member.kick("Reached maximum of 3 warns.");

                                embed.setColor("Red")
                                    .setDescription('Reached maximum of 3 warns.')
                                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                                    .setTimestamp();
                                return interaction.reply({ embeds: [embed] });
                            }

                        } catch (err) {
                            console.log(err);
                        }
                    } else {
                        embed.setColor("Orange")
                            .setDescription(`
                Warning added: ${userTag} | ||${target.id}||
                **Reason**: ${reason}
                **Evidence**: ${evidence}
                `)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });
                    }
                });

                break;
            case "check":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        embed.setColor("Green")
                            .setDescription(`${data.Content.map(
                                (w, i) =>
                                    `**ID**: ${i + 1}
                            **By**: ${w.ExecuterTag}
                            **Date**: ${w.Date}
                            **Reason**: ${w.Reason}
                            **Evidence**: ${w.Evidence}\n\n
                            `
                            ).join(" ")}`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {
                        embed.setColor("Red")
                            .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                });

                break;
            case "remove":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        data.Content.splice(warnId, 1);
                        data.save();

                        embed.setColor("Green")
                            .setDescription(`${userTag}'s warning id: ${warnId + 1} has been removed.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });

                    } else {
                        embed.setColor("Red")
                            .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                });
                break;
            case "clear":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        await warningSchema.findOneAndDelete({ GuildID: guildId, UserID: target.id, UserTag: userTag });

                        embed.setColor("Blue")
                            .setDescription(`${userTag}'s warnings were cleared. | ||${target.id}||`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });

                    } else {
                        embed.setColor("Red")
                            .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });
                    }
                });
                break;
        }
    }
}