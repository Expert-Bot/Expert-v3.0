const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Types } = require("mongoose");

const ticketSchema = require("../../Schemas/tickets/ticketSchema");
const userSchema = require("../../Schemas/tickets/userSchema");

const { createTranscript } = require("discord-html-transcripts");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isButton) {
      const { channel, member, guild, customId } = interaction;

      switch (customId) {
        case "createTicket":
          const userId = interaction.user.id;

          const data = await ticketSchema.findOne({
            guildId: guild.id,
          });

          if (!data)
            return await interaction.reply({
              content: "You have not setup the ticket system yet.",
              ephemeral: true,
            });

          const channelPermissions = [
            "ViewChannel",
            "SendMessages",
            "AddReactions",
            "ReadMessageHistory",
            "AttachFiles",
            "EmbedLinks",
            "UseApplicationCommands",
          ];

          const ticketEmbed = new EmbedBuilder().setColor("Blurple");

          interaction.guild.channels
            .create({
              name: `${interaction.user.username}-ticket`,
              type: ChannelType.GuildText,
              parent: data.categoryId,
              permissionOverwrites: [
                {
                  id: userId,
                  allow: [channelPermissions],
                },
                {
                  id: data.supportId,
                  allow: [channelPermissions],
                },
                {
                  id: interaction.guild.roles.everyone.id,
                  deny: ["ViewChannel"],
                },
              ],
            })
            .then(async (channel) => {
              userSchema.create({
                _id: Types.ObjectId(),
                guildId: guild.id,
                ticketId: channel.id,
                claimed: false,
                closed: false,
                deleted: false,
                creatorId: userId,
                claimer: null,
              });

              channel.setRateLimitPerUser(2);

              ticketEmbed
                .setTitle(`Welcome to ${interaction.channel.name}!`)
                .setDescription(
                  `Welcome <@${userId}> to your ticket. Please wait for the support team to respond to your ticket, in the meantime please explain your situation!`
                );

              channel.send({
                embeds: [ticketEmbed],
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("claimTicket")
                      .setLabel("Claim")
                      .setEmoji("<:4402yesicon:1015234867530829834>")
                      .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                      .setCustomId("closeTicket")
                      .setLabel("Close")
                      .setEmoji("<:9061squareleave:1015234841190600756>")
                      .setStyle(ButtonStyle.Success)
                  ),
                ],
              });

              await channel
                .send({
                  content: `${member}`,
                })
                .then((message) => {
                  setTimeout(() => {
                    message.delete().catch((err) => console.log(err));
                  }, 5 * 1000);
                });

              await interaction
                .reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription(
                        `Your ticket has been successfully created in <#${channel.id}>!`
                      )
                      .setColor("Green"),
                  ],
                  ephemeral: true,
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch(async (err) => {
              console.log(err);
            });
          break;

        case "claimTicket":
          const ticketDat = await ticketSchema.findOne({
            guildId: guild.id,
          });
          const userDat = await userSchema.findOne({
            guildId: guild.id,
            ticketId: channel.id,
          });

          if (userDat.claimed === true)
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(`Ticket has been claimed already.`),
              ],
              ephemeral: true,
            });

          if (!member.roles.cache.find((r) => r.id === ticketDat.supportId))
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(`Your not allowed to use this button.`),
              ],
              ephemeral: true,
            });

          await userSchema.updateMany(
            {
              ticketId: channel.id,
            },
            {
              claimed: true,
              claimer: member.id,
            }
          );

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`Ticket has been claimed`),
            ],
            ephemeral: true
          });
          break;

        case "closeTicket":
          const ticketsData = await ticketSchema.findOne({
            guildId: guild.id,
          });
          const usersData = await userSchema.findOne({
            guildId: guild.id,
            ticketId: channel.id,
          });

          if (!member.roles.cache.find((r) => r.id === ticketsData.supportId)) {
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(`You're not allowed to use this button.`),
              ],
              ephemeral: true,
            });
          }

          if (usersData.closed === true)
            return await interaction.reply({
              embeds: [
                new EmbedBuilder().setDescription("The ticket is already closed.").setColor("0x2F3136")
              ]
            });

          await userSchema.updateMany(
            {
              ticketId: channel.id,
            },
            {
              closed: true,
              closer: member.id,
            }
          );

          if (!usersData.closer == member.id)
            return await interaction.reply({
              embeds: [
                new EmbedBuilder().setDescription("You are not the user that closed this ticket!").setColor("Red")
              ],
              ephemeral: true,
            });

          client.channels.cache
            .get(usersData.ticketId)
            .permissionOverwrites.edit(usersData.creatorId, {
              ViewChannel: false,
            });

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Ticket Closed")
                .setDescription(
                  "The ticket has been closed, the user who created this ticket cannot see it now!"
                )
                .addFields(
                  {
                    name: "Ticket Creator",
                    value: `<@${usersData.creatorId}> created this ticket.`,
                  },
                  {
                    name: "Ticket Closer",
                    value: `<@${member.user.id}> closed this ticket.`,
                  },
                  {
                    name: "Closed at",
                    value: `${new Date().toLocaleString()}`,
                  }
                )
                .setFooter({
                  text: `${client.user.tag} by www.lunarcodes.org`,
                  iconURL: client.user.displayAvatarURL(),
                }),
            ],
            components: [
              new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                  .setCustomId("reopenTicket")
                  .setEmoji("🔓")
                  .setLabel("Reopen")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("deleteTicket")
                  .setEmoji("⛔")
                  .setLabel("Delete")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          });
          break;

        case "reopenTicket":
          const uData = await userSchema.findOne({
            guildId: guild.id,
            ticketId: channel.id,
          });

          if (!uData.closed)
            return await interaction.reply({
              embeds: [
                new EmbedBuilder().setDescription("The ticket is not closed.").setColor("0x2F3136")
              ]
            });

          await userSchema.updateMany(
            {
              ticketId: channel.id,
            },
            {
              closed: false,
            }
          );

          interaction.message.edit({
            components: [
              new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                .setCustomId("ticket-reopen")
                .setLabel("Reopen")
                .setEmoji("🔓")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("ticket-delete")
                  .setLabel("Delete")
                  .setEmoji("⛔")
                  .setStyle(ButtonStyle.Danger)
                  .setDisabled(true)
              ),
            ],
          });

          client.channels.cache
            .get(uData.ticketId)
            .permissionOverwrites.edit(uData.creatorId, {
              ViewChannel: true,
            });

          await interaction
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Reopened ticket!")
                  .setDescription(`Reopened by ${member.user.tag}`)
                  .setColor("Blue"),
              ],
              ephemeral: true
            })
            .catch((err) => console.log(err));
          break;
        case "deleteTicket":
          const tksData = await ticketSchema.findOne({
            guildId: guild.id,
          });
          const usrData = await userSchema.findOne({
            guildId: interaction.guild.id,
            ticketId: channel.id,
          });

          if (!member.roles.cache.find((r) => r.id === tksData.supportId)) {
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(`Your not allowed to use this button.`),
              ],
              ephemeral: true,
            });
          }

          interaction.message.edit({
            components: [
              new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                  .setCustomId("ticket-close")
                  .setLabel("Close Ticket")
                  .setStyle(ButtonStyle.Danger)
                  .setDisabled(true)
              ),
            ],
          });

          userSchema
            .findOneAndDelete({
              guildId: guild.id,
            })
            .catch((err) => console.log(err));

          setTimeout(
            () => channel.delete().catch((err) => console.log(err)),
            5 * 1000
          );

          const transcript = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `Ticket-${member.user.username}.html`,
          });

          await client.channels.cache
            .get(tksData.logsId)
            .send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("closed ticket.")
                  .setDescription(`Transcript: (download)[${transcript}]`)
                  .addFields(
                    {
                      name: "Closer",
                      value: `<@${usrData.closer}>`
                    },
                    {
                      name: "Ticket Deleted By",
                      value: `<@${member.user.id}>`
                    },
                    {
                      name: "Deleted At",
                      value: `${new Date().toLocaleString()}`
                    }
                  )
                  .setColor("Blue"),
              ],
              files: [transcript],
            })
            .catch((err) => console.log(err));

          await interaction
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("closed ticket.")
                  .setDescription(`Deleted by ${member.user.tag}`)
                  .addFields({
                    name: "Time",
                    value: "Ticket will be Deleted in 5 seconds...",
                  })
                  .setColor("Blue"),
              ],
            })
            .catch((err) => console.log(err));

          break;
        default:
          break;
      }
    }
  },
};
