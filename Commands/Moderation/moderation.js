const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
} = require("discord.js");

const modSchema = require("../../Schemas/moderation/modSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderate a selected member!")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.ModerateMembers
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("Kick a member!")

        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("User to kick.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason for the kick.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ban")
        .setDescription("ban a member!")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("User to ban.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason for the ban.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("timeout")
        .setDescription("Timeout a member!")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("User to timeout.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("time")
            .setDescription("Time in minutes to timeout the member.")
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason for the timeout.")
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === "kick") {
      const user = interaction.options.getUser("target");
      const target = interaction.options.getMember("target");
      let reason = interaction.options.getString("reason");
      const modSys = await modSchema.findOne({ guildId: interaction.guild.id });
      const member = await interaction.guild.members
        .fetch(user.id)
        .catch((err) => console.log(err));

      if (!reason) {
        reason = "No reason was provided.";
      }

      if (user.id === interaction.user.id) {
        interaction.reply({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription("You cannot kick yourself dummy."),
          ],
          ephemeral: true,
        });
        return;
      }

      if (user.id === client.user.id) {
        interaction.reply({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription("You cannot kick me dummy."),
          ],
          ephemeral: true,
        });
        return;
      }

      if (
        target.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "The member has a higher role than you so i cannot kick them."
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      if (!interaction.guild.members.me.permissions.has("KickMembers")) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription("I do not have the permission to kick members."),
          ],
          ephemeral: true,
        });
        return;
      }

      if (!member.kickable) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "That member is higher than my role, or i don't have permissions to kick them."
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      const userEmbed = new EmbedBuilder()
        .setTitle(`You have been kicked from ${interaction.guild.name}`)
        .addFields(
          {
            name: "Date",
            value: new Date().toLocaleString(),
            inline: true,
          },
          {
            name: "Guild Id",
            value: interaction.guild.id,
            inline: true,
          },
          {
            name: "Reason",
            value: `\`\`\`${reason}\`\`\``,
          }
        )
        .setColor("Red")
        .setTimestamp();

      await interaction.deferReply({
        ephemeral: true,
      });

      await user
        .send({
          embeds: [userEmbed],
        })
        .catch(async (err) => {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `I could not DM ${user.username} since they don't have dms on.`
                ),
            ],
            ephemeral: true,
          });
        });

      await member.kick(reason).catch((err) => console.log(err));

      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${user.username} has been kicked.`)
            .addFields(
              {
                name: "user",
                value: user.username,
              },
              {
                name: "reason",
                value: reason,
              }
            ),
        ],
        ephemeral: true,
      });

      if (
        !interaction.guild.members.me
          .permissionsIn(modSys.channelId)
          .has(["EmbedLinks", "SendMessages", "ViewChannel"])
      ) {
        interaction.user.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "I do not have permissions to access that channel.\nPlease add me to the channel and give me permissions!"
              )
              .addFields(
                {
                  name: "Channel:",
                  value: `<${modSys.channelId}>`,
                },
                {
                  name: "Required Permissions",
                  value: "`EmbedLinks, ViewChannel, and SendMessages`",
                }
              ),
          ],
        });

        await interaction.followUp({
          content: "Message not sent in logs channel because of an error.",
          ephemeral: true,
        });
        return;
      } 
      if (modSys.channelId &&
        interaction.guild.members.me
          .permissionsIn(modSys.channelId)
          .has(["EmbedLinks", "SendMessages", "ViewChannel"])) {
        const channel = interaction.guild.channels.cache.get(modSys.channelId);

        if (channel) {
          channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle(`${member.user.username} has been kicked!`)
                .addFields(
                  {
                    name: "Kicked User",
                    value: user.tag,
                    inline: true,
                  },
                  {
                    name: "Kicked User ID",
                    value: user.id,
                    inline: true,
                  },
                  {
                    name: "Kicked by",
                    value: interaction.member.user.tag,
                    inline: true,
                  },
                  {
                    name: "Kicked At",
                    value: new Date().toLocaleString(),
                    inline: true,
                  },
                  {
                    name: "Reason",
                    value: `\`\`\`${reason || "No reason provided"}\`\`\``,
                  }
                ),
            ],
          });
        }
      }
    } else if (interaction.options.getSubcommand() === "ban") {
      const user = interaction.options.getUser("target");
      const target = interaction.options.getMember("target");
      let reason = interaction.options.getString("reason");
      const modSys = await modSchema.findOne({ guildId: interaction.guild.id });
      const member = await interaction.guild.members
        .fetch(user.id)
        .catch((err) => console.log(err));

      if (!reason) {
        reason = "No reason was provided.";
      }

      if (user.id === interaction.user.id) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Yellow")
              .setDescription("You cannot ban yourself dummy."),
          ],
          ephemeral: true,
        });
        return;
      }

      if (!member.bannable) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "That member is higher than my role, or i don't have permissions to ban them."
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      if (user.id === client.user.id) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Yellow")
              .setDescription("You cannot ban me dummy."),
          ],
          ephemeral: true,
        });
        return;
      }

      if (
        target.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "The member has a higher role than you so i cannot ban them."
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      if (!interaction.guild.members.me.permissions.has("BanMembers")) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription("I do not have the permission to ban members."),
          ],
          ephemeral: true,
        });
        return;
      }

      const userEmbed = new EmbedBuilder()
        .setTitle(`You have been banned from ${interaction.guild.name}`)
        .addFields(
          {
            name: "Date",
            value: new Date().toLocaleString(),
            inline: true,
          },
          {
            name: "Guild Id",
            value: interaction.guild.id,
            inline: true,
          },
          {
            name: "Reason",
            value: `\`\`\`${reason}\`\`\``,
          }
        )
        .setColor("Red")
        .setTimestamp();

      await interaction.deferReply({
        ephemeral: true,
      });

      await user
        .send({
          embeds: [userEmbed],
        })
        .catch(async (err) => {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `I could not DM ${user.username} since they don't have dms on.`
                ),
            ],
            ephemeral: true,
          });
        });

      await member
        .ban({
          reason: reason,
          deleteMessageDays: 1,
        })
        .catch((err) => console.log(err));

      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${user.username} has been banned.`)
            .addFields(
              {
                name: "user",
                value: user.username,
              },
              {
                name: "reason",
                value: reason,
              }
            ),
        ],
        ephemeral: true,
      });

      if (modSys.channelId) {
        const channel = interaction.guild.channels.cache.get(modSys.channelId);

        if (
          !interaction.guild.members.me
            .permissionsIn(modSys.channelId)
            .has(["EmbedLinks", "SendMessages", "ViewChannel"])
        ) {
          interaction.user.send({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "I do not have permissions to access that channel.\nPlease add me to the channel and give me permissions!"
                )
                .addFields(
                  {
                    name: "Channel:",
                    value: `<${modSys.channelId}>`,
                  },
                  {
                    name: "Required Permissions",
                    value: "`EmbedLinks, ViewChannel, and SendMessages`",
                  }
                ),
            ],
          });

          await interaction.followUp({
            content: "Message not sent in logs channel because of an error.",
            ephemeral: true,
          });
          return;
        }
         if (modSys.channelId &&
          interaction.guild.members.me
            .permissionsIn(modSys.channelId)
            .has(["EmbedLinks", "SendMessages", "ViewChannel"])) {
          const channel = interaction.guild.channels.cache.get(
            modSys.channelId
          );

          if (channel) {
            channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setTitle(`${member.user.username} has been kicked!`)
                  .addFields(
                    {
                      name: "Kicked User",
                      value: user.tag,
                      inline: true,
                    },
                    {
                      name: "Kicked User ID",
                      value: user.id,
                      inline: true,
                    },
                    {
                      name: "Kicked by",
                      value: interaction.member.user.tag,
                      inline: true,
                    },
                    {
                      name: "Kicked At",
                      value: new Date().toLocaleString(),
                      inline: true,
                    },
                    {
                      name: "Reason",
                      value: `\`\`\`${reason || "No reason provided"}\`\`\``,
                    }
                  ),
              ],
            });
          }
        }
      }
    }
    if (interaction.options.getSubcommand() === "timeout") {
      let reason = interaction.options.getString("reason");
      let time = interaction.options.getInteger("time");
      const user = interaction.options.getUser("target");
      const target = interaction.options.getMember("target");
      const member = await interaction.guild.members
        .fetch(user.id)
        .catch((err) => console.log(err));

      if (!reason) {
        reason = "No reason was provided.";
      }

      if (user.id === interaction.user.id) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Yellow")
              .setDescription("You cannot timeout yourself dummy."),
          ],
          ephemeral: true,
        });
        return;
      }

      if (user.id === client.user.id) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Yellow")
              .setDescription("You cannot time me out dummy."),
          ],
          ephemeral: true,
        });
        return;
      }

      if (
        target.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "The member has a higher role than you so i cannot timeout them."
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      if (!interaction.guild.members.me.permissions.has("ModerateMembers")) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "I do not have the permission to Timeout (Moderate) members."
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      if (!time) {
        time = null;
      }

      await interaction.deferReply({
        ephemeral: true,
      });

      user
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle(
                `You have been timed out from ${interaction.guild.name}`
              )
              .addFields(
                {
                  name: "Date",
                  value: new Date().toLocaleString(),
                  inline: true,
                },
                {
                  name: "Guild Id",
                  value: interaction.guild.id,
                  inline: true,
                },
                {
                  name: "Duration",
                  value: `${time} minutes`,
                },
                {
                  name: "Reason",
                  value: `\`\`\`${reason}\`\`\``,
                }
              ),
          ],
          ephemeral: true,
        })
        .catch(async (err) => {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `I could not DM ${user.username} since they don't have dms on.`
                ),
            ],
            ephemeral: true,
          });
        });

      await member
        .timeout(time == null ? null : time * 60 * 1000, reason)
        .catch((err) => console.log(err));

      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${user.username} has been timed out.`)
            .addFields(
              {
                name: "user",
                value: user.username,
              },
              {
                name: "Duration",
                value: `${time} minutes`,
              },
              {
                name: "reason",
                value: reason,
              }
            ),
        ],
        ephemeral: true,
      });

      const modSys = await modSchema.findOne({ guildId: interaction.guild.id });

      if (
        !interaction.guild.members.me
          .permissionsIn(modSys.channelId)
          .has(["EmbedLinks", "SendMessages", "ViewChannel"])
      ) {
        interaction.user.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "I do not have permissions to access that channel.\nPlease add me to the channel and give me permissions!"
              )
              .addFields(
                {
                  name: "Channel:",
                  value: `<${modSys.channelId}>`,
                },
                {
                  name: "Required Permissions",
                  value: "`EmbedLinks, ViewChannel, and SendMessages`",
                }
              ),
          ],
        });

        interaction.followUp({
          content: "Message not sent in logs channel because of an error.",
          ephemeral: true,
        });
        return;
      }
      if (
        modSys.channelId &&
        interaction.guild.members.me
          .permissionsIn(modSys.channelId)
          .has(["EmbedLinks", "SendMessages", "ViewChannel"])
      ) {
        const channel = interaction.guild.channels.cache.get(modSys.channelId);

        if (channel) {
          channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle(`${member.user.username} has been kicked!`)
                .addFields(
                  {
                    name: "Timeouted User",
                    value: user.tag,
                    inline: true,
                  },
                  {
                    name: "Timeouted User ID",
                    value: user.id,
                    inline: true,
                  },
                  {
                    name: "Timeouted by",
                    value: interaction.member.user.tag,
                    inline: true,
                  },
                  {
                    name: "Timeouted At",
                    value: new Date().toLocaleString(),
                    inline: true,
                  },
                  {
                    name: "Reason",
                    value: `\`\`\`${reason || "No reason provided"}\`\`\``,
                  }
                ),
            ],
          });
        }
      }
    }
  },
};
