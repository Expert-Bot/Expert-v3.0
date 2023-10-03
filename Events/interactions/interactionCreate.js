const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits,
  resolveColor,
} = require("discord.js");
const { Api } = require('@top-gg/sdk');
const topgg = new Api("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMjM4MTA3MTUyNTA4NjAxMDUiLCJib3QiOnRydWUsImlhdCI6MTY5NTQ2Njk0NX0.Gsc7utYgXzD_BZ04NafnBLKLprokL6pOL4bnIT2-xHw");
const { ViewChannel, SendMessages, ReadMessageHistory } = PermissionFlagsBits;
const { createTranscript } = require("discord-html-transcripts");
const blacklistDB = require("../../Schemas/blacklistSchema")
const suggestSchema = require("../../Models/SuggestChannel");
const suggestionSchema = require("../../Models/Suggestion");

const TicketSetup = require("../../Models/TicketSetup");
const ticketSchema = require("../../Models/Ticket");

const githubSetup = require("../../Models/GitHubSetup");
const GitHubSchema = require("../../Models/GitHub");
const { isUserPremium } = require("../../Functions/codeFunction");
const Dev = require("../../Models/Developer");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const {
      customId,
      values,
      fields,
      member,
      user,
      guild,
      commandName,
      channel,
      guildId,
      message,
    } = interaction;

    const errEmbed = new EmbedBuilder().setColor("Red");

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(commandName);
//vote system//
//vote required
      if (command.voteRequired) {
        const btn_link = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Vote Me")
            .setEmoji("🔗")
            .setStyle(ButtonStyle.Link)
            .setURL("https://top.gg/bot/1023810715250860105/vote")
        )

        const voted = new EmbedBuilder()
          .setTitle("Vote Required")
          .setDescription("**You must vote in [https://top.gg/bot/1023810715250860105/vote) to unlock this command**")
          .setFooter({ text: "Xepert | Vote Required" })
        const hasVoted = await topgg.hasVoted(interaction.user.id);
        if (!hasVoted) {
          interaction.reply({ embeds: [voted], components: [btn_link] });
          return;
        }
      }
      //moderation filter
      if (command.moderatorOnly) {
        if (
          !member.roles.cache.has("1107332474402513007") ||
          !member.roles.cache.has("1107332474402513007") ||
          !member.roles.cache.has("1107332474402513007") ||
          !member.roles.cache.has("1107332474402513007")
        ) {
          errEmbed.setDescription(
            "⛔ | Whoops! You don't have permissions for that!"
          );
          return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
      }
      //premium//
      const isPremium = await isUserPremium(interaction.user.id);
      console.log(isPremium);

      if (command.premiumOnly && !isPremium) {
        return interaction.reply({
          content: "Sorry, this command is only available to premium users. <a:MTF_Credits:1082731156711149721> ",
          ephemeral: true,
        });
      }
      //bl
      if (!interaction.isChatInputCommand()) return;
      const userData = await blacklistDB.findOne({
        userId: interaction.user.id,
      });
      if (userData) {
        const embed = new EmbedBuilder()
          .setTitle("Blacklisted User")
          .setDescription(
            `You are blacklisted from using this bot.\n\nReason: ${userData.reason}`
          )
          .setColor("Red")
          .setTimestamp()
        return interaction.reply({ embeds: [embed] });
      }
      //admin filter
      if (command.adminOnly) {
        if (
          !member.roles.cache.has("1107332474402513007") ||
          !member.roles.cache.has("1107332474402513007") ||
          !member.roles.cache.has("1107332474402513007")
        ) {
          errEmbed.setDescription(
            "⛔ | Whoops! You don't have permissions for that!"
          );
          return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
      }

      if (!command) {
        return interaction.reply({
          content: "outdated command",
          ephemeral: true,
        });
      }

      command.execute(interaction, client);
    }
    //1081236775097352282
    if (interaction.isModalSubmit()) {
      if (customId == "developerModal") {
        const channel = await client.channels.cache.get("1101154380381692055");
        if (!channel) return console.log("No channel set for developer apps");
        const a =
          interaction.fields.getTextInputValue("usernameBuilder") || undefined;
        const b =
          interaction.fields.getTextInputValue("wwydBuilder") || undefined;
        const c = interaction.fields.getTextInputValue("abty") || undefined;
        const d =
          interaction.fields.getTextInputValue("socialsBuilder") || undefined;
        const e =
          interaction.fields.getTextInputValue("yoeBuilder") || undefined;

        interaction.reply({
          content: `Applied for developer application`,
          ephemeral: true,
        });

        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Application",
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `${interaction.user.tag} wants to be a developer!`
          )
          .setThumbnail('https://images-ext-2.discordapp.net/external/sb77Jpet1fEG9GlI2kL7_hkGEM1Nxpae92xopdI0imw/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/1023810715250860105/2f22b4cdf8aebf2562d590c8dab69bf9.webp?width=657&height=657')
          .addFields(
            { name: "Username", value: `\`${a}\``, inline: true },
            { name: "Description", value: b, inline: true },
            { name: "About", value: c, inline: false },
            { name: "Experience", value: e, inline: false },
            { name: "Socials", value: d, inline: false },
          )
          .setFooter({ text: "Pending", iconURL: "https://kajdev.org/img/pending.png" })
          .setColor("#235ee7");
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("devapp_accept")
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("devapp_declined")
            .setLabel("Decline")
            .setStyle(ButtonStyle.Secondary)
        );
        const page = await channel.send({
          content: "New Developer Application",
          embeds: [embed],
          components: [buttons],
        });

        const newdata = new Dev({
          Guild: interaction.guild.id,
          User: interaction.user.id,
          MessageID: page.id,
        });

        newdata.save();

        // if (suggestionEmbed.data.footer.text == "Pending") {
        //   suggestionEmbed.data.footer.text = "Accepted";
        //   suggestionEmbed.data.footer.icon_url =
        //     "https://kajdev.org/img/acceptedicon.png";
        // }
      }

      if (customId == "sayModal") {
        const modalTitle = fields.getTextInputValue("modalSayTitle") || null;
        const modalColor =
          fields.getTextInputValue("modalSayColor") || "#2F3136";
        const modalThumbnail =
          fields.getTextInputValue("modalSayThumbnail") || undefined;
        const modalTimestamp = fields.getTextInputValue("modalSayTimestamp");
        const modalDescription =
          fields.getTextInputValue("modalSayDescription") || undefined;
        const embed = new EmbedBuilder()
          .setTitle(modalTitle)
          .setThumbnail(modalThumbnail)
          .setDescription(modalDescription)
          .setColor(modalColor);

        if (modalTimestamp == "Yes") embed.setTimestamp();

        await channel.send({ embeds: [embed] });

        interaction.reply({
          content: `Succesfully sent the embed to ${channel}.`,
          ephemeral: true,
        });
      }

      if (customId == "githubModal") {
        githubSetup.findOne({ Guild: guildId }, async (err, data) => {
          GitHubSchema.findOne(
            { Guild: guildId, UserID: user.id },
            async (err, data2) => {
              // if (data2) {
              //   const embed = new EmbedBuilder()
              //     .setDescription(
              //       "You already requested access to the github repository. Please be patient!"
              //     )
              //     .setColor("#235ee7")
              //     .setTimestamp();

              //   return interaction.reply({ embeds: [embed], ephemeral: true });
              // }

              const modalPatreonEmail = fields.getTextInputValue(
                "modalGithHubDescription"
              );
              const modalGithubEmail = fields.getTextInputValue(
                "modalGithHubDescription2"
              );

              const embed = new EmbedBuilder()
                .setAuthor({
                  name: "Access Request",
                  iconURL: "https://images-ext-2.discordapp.net/external/sb77Jpet1fEG9GlI2kL7_hkGEM1Nxpae92xopdI0imw/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/1023810715250860105/2f22b4cdf8aebf2562d590c8dab69bf9.webp?width=657&height=657",
                })
                .setDescription(
                  "You have requested github access! Please be patient.\n\n**Note: enable dm's to get notified when you get accepted**"
                )
                .setColor("#235ee7")
                .setTimestamp();

              const githubChannel = guild.channels.cache.get(data.Channel);

              const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId(`githubConfirm`)
                  .setEmoji("983397232604766219")
                  .setStyle(ButtonStyle.Secondary)
              );

              const m = githubChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setAuthor({
                      name: `${member.user.tag}`,
                      iconURL: member.displayAvatarURL(),
                    })
                    .setDescription("A user requested access to the github!")
                    .addFields(
                      { name: "Patreon Email", value: `${modalPatreonEmail}` },
                      { name: "Github Username", value: `${modalGithubEmail}` },
                      { name: "User ID", value: `${user.id}` }
                    )
                    .setColor("#235ee7")
                    .setFooter({
                      text: "Pending",
                      iconURL: "https://kajdev.org/img/pending.png",
                    })
                    .setTimestamp()
                    .setThumbnail("https://images-ext-2.discordapp.net/external/sb77Jpet1fEG9GlI2kL7_hkGEM1Nxpae92xopdI0imw/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/1023810715250860105/2f22b4cdf8aebf2562d590c8dab69bf9.webp?width=657&height=657"),
                ],
                components: [buttons],
              });

              // GitHubSchema.create({
              //   Guild: guildId,
              //   MessageID: m.id,
              //   UserID: user.id,
              //   PEmail: modalPatreonEmail,
              //   GEmail: modalGithubEmail,
              // });

              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
          );
        });
      }

      if (customId == "suggestModal") {
        const modalTitle = fields.getTextInputValue("modalSuggestTitle");
        const modalDescription = fields.getTextInputValue(
          "modalSuggestDescription"
        );

        const embed = new EmbedBuilder()
          .setColor("#235ee7")
          .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`**Type:** ${modalTitle}`)
          .addFields({
            name: "Suggestion:",
            value: modalDescription,
            inline: false,
          })
          .addFields(
            { name: "Upvotes:", value: `${0}`, inline: true },
            { name: "Downvotes:", value: `${0}`, inline: true }
          )
          .setFooter({
            text: "Pending",
            iconURL: "https://kajdev.org/img/pending.png",
          })
          .setTimestamp();

        suggestSchema.findOne({ GuildID: guildId }, async (err, data) => {
          if (!data || !data.ChannelID) {
            return interaction.reply({
              content: "The suggestion system is not set up yet.",
              ephemeral: true,
            });
          }

          const suggestionChannel = guild.channels.cache.get(data.ChannelID);

          const buttons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`suggestCheck`)
                .setEmoji("983397232604766219")
                .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`suggestCross`)
                .setEmoji("983397212551786567")
                .setStyle(ButtonStyle.Secondary)
            );

          const m = await suggestionChannel.send({
            embeds: [embed],
            fetchReply: true,
            components: [buttons],
          });

          await suggestionSchema.create({
            GuildID: guildId,
            MessageID: m.id,
            Details: [
              {
                MemberID: member.id,
                Type: modalTitle,
                Suggestion: modalDescription,
              },
            ],
            AcceptedReacted: [],
            DeclinedReacted: [],
          });

          if (err) {
            return interaction.reply({
              content: `❌ | Something went wrong!`,
              ephemeral: true,
            });
          }

          return interaction.reply({
            content: `✅ | Your suggestion was succesfully sent to ${suggestionChannel}!`,
            ephemeral: true,
          });
        });
      }

      if (customId == "ticketModal") {
        const modalSubject = fields.getTextInputValue("modalTicketSubject");
        const modalDescription = fields.getTextInputValue(
          "modalTicketDescription"
        );
        let modalColor =
          fields.getTextInputValue("modalTicketColor") || "#235ee7";

        try {
          resolveColor(modalColor);
          modalColor = modalColor;
        } catch (err) {
          modalColor = "#235ee7";
        }

        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        const data = await TicketSetup.findOne({ GuildID: guildId });

        if (!data)
          return interaction.reply({
            content: `Ticket system has not been set up yet in guild. ||${guildId}||`,
            ephemeral: true,
          });

        try {
          await guild.channels
            .create({
              name: `${member.user.username}-ticket${ticketId}`,
              type: ChannelType.GuildText,
              parent: data.Category,
              permissionOverwrites: [
                {
                  id: data.Everyone,
                  deny: [ViewChannel, SendMessages, ReadMessageHistory],
                },
                {
                  id: member.id,
                  allow: [ViewChannel, SendMessages, ReadMessageHistory],
                },
                {
                  id: data.Handlers,
                  allow: [ViewChannel, SendMessages, ReadMessageHistory],
                },
              ],
            })
            .then(async (channel) => {
              await ticketSchema.create({
                GuildID: guild.id,
                MembersID: member.id,
                TicketID: ticketId,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: modalSubject,
		Claimed: false,  

              
              });



              const embed = new EmbedBuilder()
                .setThumbnail("https://images-ext-2.discordapp.net/external/sb77Jpet1fEG9GlI2kL7_hkGEM1Nxpae92xopdI0imw/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/1023810715250860105/2f22b4cdf8aebf2562d590c8dab69bf9.webp?width=657&height=657")
                .addFields(
                  { name: "Subject", value: modalSubject },
                  { name: "Description", value: modalDescription }
                )
                .setColor(modalColor)
                .setAuthor({
                  name: `${member.user.tag}`,
                  iconURL: member.displayAvatarURL(),
                })
                .setFooter({
                  text: `${ticketId}`,
                  iconURL: "https://kajdev.org/img/idn.png",
                })
                .setTimestamp();

              const button = new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                  .setCustomId("closeTicketButton")
                  .setLabel("Close ticket")
                  .setStyle(ButtonStyle.Secondary)
                  .setEmoji("🔒")
              );

              channel.send({
                embeds: [embed],
                components: [button],
              });

              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(`Ticket created in ${channel}`)
                    .setColor("#235ee7")
                    .setFooter({
                      text: `${ticketId}`,
                      iconURL: "https://kajdev.org/img/idn.png",
                    })
                    .setTimestamp(),
                ],
                ephemeral: true,
              });
            });
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (interaction.isButton()) {
      if (customId == "devapp_accept") {
        if (
          interaction.user.id !== "903237169722834954"
        ) {
          return interaction.reply({
            content: "You are not permitted to do that!",
            ephemeral: true,
          });
        }
        const embedd = new EmbedBuilder().setColor("Orange");
        const embed = message.embeds[0];
        const D = await Dev.findOne({ Guild: guild.id, MessageID: message.id });
        embed.data.fields[5] = {
          name: "Status",
          value: "Accepted",
          inline: true,
        };
        const AcceptedEmbed = EmbedBuilder.from(embed).setColor("Green");
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("accept")
            .setLabel("Accept")
            .setDisabled(true)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("decline")
            .setLabel("Decline")
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger)
        );
        message.edit({ embeds: [AcceptedEmbed], components: [buttons] });
        interaction.reply({
          embeds: [
            embedd.setDescription(
              "Successfully accepted the application!\nRole has been assigned to the user"
            ),
          ],
          ephemeral: true,
        });
        const embeds = new EmbedBuilder()
          .setTitle("Developer Application Accepted")
          .setDescription(
            "Your developer application has been accepted\nThe role has been assigned"
          )
          .setColor("Green");
        const user = await guild.members.cache.get(D.User);
        user.send({ content: "Congratulations", embeds: [embeds] });
        await user.roles.add("1091125125677600768");
        await Dev.findOneAndDelete({ Guild: guild.id, MessageID: message.id });
      }
      if (customId == "devapp_declined") {
        if (
          !member.roles.cache.has("1091125073680797788") ||
          interaction.user.id !== "903237169722834954"
        ) {
          return interaction.reply({
            content: "You don't have permission to use this",
            ephemeral: true,
          });
        }
        const embedd = new EmbedBuilder().setColor("Orange");
        const embed = message.embeds[0];
        const D = await Dev.findOne({ Guild: guild.id, MessageID: message.id });
        embed.data.fields[5] = {
          name: "Status",
          value: "Declined",
          inline: true,
        };
        const DeclinedEmbed = EmbedBuilder.from(embed).setColor("Red");
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("accept")
            .setLabel("Accept")
            .setDisabled(true)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("decline")
            .setLabel("Decline")
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger)
        );
        message.edit({ embeds: [DeclinedEmbed], components: [buttons] });
        interaction.reply({
          embeds: [
            embedd.setDescription("Successfully declined the application!"),
          ],
          ephemeral: true,
        });
        const embeds = new EmbedBuilder()
          .setTitle("Developer Application Denied")
          .setDescription("Your developer application has been denied")
          .setColor("Red");
        const user = await client.users.cache.get(D.User);
        user.send({ content: "Denied", embeds: [embeds] });
        await Dev.findOneAndDelete({ Guild: guild.id, MessageID: message.id });
      }

      if (customId == "githubConfirm") {
        GitHubSchema.findOne({ MessageID: message.id }, async (err, data) => {
          const githubEmbed = message.embeds[0];

          if (githubEmbed.data.footer.text == "Pending") {
            githubEmbed.data.footer.text = "Accepted";
            githubEmbed.data.footer.icon_url =
              "https://kajdev.org/img/acceptedicon.png";
          }

          const patreonMail = githubEmbed.fields[0].value;
          const githubMail = githubEmbed.fields[1].value;
          const discordUserId = githubEmbed.fields[2].value;

          try {

            // Verify that the user is a patron of your campaign and has connected their account to a subscription that includes the "Source Codes" tier
            verifyPatreonMembership(patreonMail)

            // const member = result.data.find(m => m.attributes.email === patreonMail);

            // if (!member) {
            //   return interaction.reply({
            //     content: 'Sorry, you are not a patron of our campaign!',
            //     ephemeral: true
            //   });
            // }

            // const entitledTiers = member.relationships.currently_entitled_tiers.data;

            // if (!entitledTiers.some(t => t.attributes.title === 'Source Codes')) {
            //   return interaction.reply({
            //     content: 'Sorry, you need to be a patron of our campaign at the "Source Codes" tier to access the GitHub repository!',
            //     ephemeral: true
            //   });
            // }

            // const Octokit = require('@octokit/rest');
            // const octokit = new Octokit({
            //   auth: githubAccessToken
            // });

            // const response = await octokit.repos.addCollaborator({
            //   owner: githubOwner,
            //   repo: githubRepo,
            //   username: githubMail,
            //   permission: 'pull'
            // });

            // console.log(response);

            message.edit({ embeds: [githubEmbed] });

            const fetchedUser = guild.members.cache.get(
              githubEmbed.fields[2].value
            );

            await fetchedUser.send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    "Congratulations! 🎉 Your request to have access to the github was accepted."
                  )
                  .setColor("#235ee7")
                  .setTimestamp(),
              ],
            });

            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription("✅ Successfully accepted!")
                  .setColor("Green"),
              ],
              ephemeral: true,
            });
          } catch (err) {
            console.error(err);

            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    "❌ An error occurred while accepting the request!"
                  )
                  .setColor("Red"),
              ],
              ephemeral: true,
            });
          }

        });
      }
      suggestSchema.findOne({ GuildID: guildId }, async (err, data2) => {
        if (customId == "suggestCheck") {
          suggestionSchema.findOne(
            { MessageID: message.id },
            async (err, data) => {
              const suggestionEmbed = message.embeds[0];

              if (!data || !data2) return;

              try {
                if (data.AcceptedReacted.includes(member.id)) {
                  // already upvoted
                  data.AcceptedReacted = data.AcceptedReacted.filter(
                    (e) => e !== member.id
                  );
                  data.save();

                  const newUpvoteCount =
                    parseInt(suggestionEmbed.fields[1].value) - 1;
                  suggestionEmbed.fields[1].value = `${newUpvoteCount}`;
                  message.edit({ embeds: [suggestionEmbed] });

                  return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setDescription("✅ | Upvote removed!")
                        .setColor("Green"),
                    ],
                    ephemeral: true,
                  });
                }

                if (data.DeclinedReacted.includes(member.id)) {
                  //already downvoted
                  data.DeclinedReacted = data.DeclinedReacted.filter(
                    (e) => e !== member.id
                  );

                  const newDownvoteCount =
                    parseInt(suggestionEmbed.fields[2].value) - 1;
                  suggestionEmbed.fields[2].value = `${newDownvoteCount}`;
                  message.edit({ embeds: [suggestionEmbed] });
                }

                data.AcceptedReacted.push(member.id);
                data.save();

                if (
                  data2.Reactions ==
                  parseInt(suggestionEmbed.fields[1].value) + 1
                ) {
                  if (suggestionEmbed.data.footer.text == "Pending") {
                    suggestionEmbed.data.footer.text = "Accepted";
                    suggestionEmbed.data.footer.icon_url =
                      "https://kajdev.org/img/acceptedicon.png";
                  }
                }

                const newUpvoteCount =
                  parseInt(suggestionEmbed.fields[1].value) + 1;
                suggestionEmbed.fields[1].value = `${newUpvoteCount}`;
                message.edit({ embeds: [suggestionEmbed] });

                return interaction.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription("⬆️ | Succesfully upvoted!")
                      .setColor("Blue"),
                  ],
                  ephemeral: true,
                });
              } catch (err) {
                console.log(err);
              }
            }
          );
        }
        if (customId == "suggestCross") {
          suggestionSchema.findOne(
            { MessageID: message.id },
            async (err, data) => {
              const suggestionEmbed = message.embeds[0];

              if (!data || !data2) return;

              try {
                if (data.DeclinedReacted.includes(member.id)) {
                  //already downvoted
                  data.DeclinedReacted = data.DeclinedReacted.filter(
                    (e) => e !== member.id
                  );
                  data.save();

                  const newDownvoteCount =
                    parseInt(suggestionEmbed.fields[2].value) - 1;
                  suggestionEmbed.fields[2].value = `${newDownvoteCount}`;
                  message.edit({ embeds: [suggestionEmbed] });

                  return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setDescription("✅ | Downvote removed!")
                        .setColor("Green"),
                    ],
                    ephemeral: true,
                  });
                }

                if (data.AcceptedReacted.includes(member.id)) {
                  //already upvoted
                  data.AcceptedReacted = data.AcceptedReacted.filter(
                    (e) => e !== member.id
                  );

                  const newUpvoteCount =
                    parseInt(suggestionEmbed.fields[1].value) - 1;
                  suggestionEmbed.fields[1].value = `${newUpvoteCount}`;
                  message.edit({ embeds: [suggestionEmbed] });
                }

                data.DeclinedReacted.push(member.id);
                data.save();

                if (
                  data2.Reactions ==
                  parseInt(suggestionEmbed.fields[1].value) + 1
                ) {
                  if (suggestionEmbed.data.footer.text == "Pending") {
                    suggestionEmbed.data.footer.text = "Declined";
                    suggestionEmbed.data.footer.icon_url =
                      "https://kajdev.org/img/crossicon.png";
                  }
                }

                const newDownvoteCount =
                  parseInt(suggestionEmbed.fields[2].value) + 1;
                suggestionEmbed.fields[2].value = `${newDownvoteCount}`;
                message.edit({ embeds: [suggestionEmbed] });

                return interaction.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription("⬇️ | Succesfully downvoted!")
                      .setColor("Blue"),
                  ],
                  ephemeral: true,
                });
              } catch (err) {
                console.log(err);
              }
            }
          );
        }
        if (customId == "ticketButton") {
          const modal = new ModalBuilder()
            .setCustomId("ticketModal")
            .setTitle("Create a ticket");

          const modalTitle = new TextInputBuilder()
            .setCustomId("modalTicketSubject")
            .setLabel("Subject")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("For example: Question")
            .setMaxLength(128)
            .setRequired(true);

          const modalDescription = new TextInputBuilder()
            .setCustomId("modalTicketDescription")
            .setLabel("Description")
            .setPlaceholder("Short explanation for your ticket")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          const modalColor = new TextInputBuilder()
            .setCustomId("modalTicketColor")
            .setLabel("Ticket Color (Leave blank for default)")
            .setPlaceholder("Pink")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(10)
            .setRequired(false);

          const firstActionRow = new ActionRowBuilder().addComponents(
            modalTitle
          );
          const secondActionRow = new ActionRowBuilder().addComponents(
            modalDescription
          );
          const thirdActionRow = new ActionRowBuilder().addComponents(
            modalColor
          );

          modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

          await interaction.showModal(modal);
        }
      });

      if (customId == "closeTicketButton") {
        TicketSetup.findOne({ GuildID: guildId }, async (err, docs) => {
          ticketSchema.findOne({ ChannelID: channel.id }, async (err, data) => {
            if (err)
              return interaction.reply({ content: `${err}`, ephemeral: true });

            if (!data)
              return interaction.reply({
                content: "Ticket was not found in the database.",
                ephemeral: true,
              });

            if (data.Closed == true)
              return interaction.reply({
                content: "Ticket is already getting deleted.",
                ephemeral: true,
              });

            const transcript = await createTranscript(channel, {
              limit: -1,
              returnBuffer: false,
              fileName: `ticket-${data.TicketID}.html`,
            });

            data.Closed = true;
            data.save();

            const transcriptEmbed = new EmbedBuilder()
              .addFields(
                { name: `Transcript Type`, value: `${data.Type}` },
                { name: `Ticket ID`, value: `${data.TicketID}` },
                { name: `Closed by`, value: `${member}` }
              )
              .setThumbnail("https://images-ext-2.discordapp.net/external/sb77Jpet1fEG9GlI2kL7_hkGEM1Nxpae92xopdI0imw/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/1023810715250860105/2f22b4cdf8aebf2562d590c8dab69bf9.webp?width=657&height=657")
              .setFooter({
                text: member.user.tag,
                iconURL: member.displayAvatarURL({ dynamic: true }),
              })
              .setColor(0x235ee7)
              .setTimestamp();

            await guild.channels.cache.get(docs.Transcripts).send({
              embeds: [transcriptEmbed],
              files: [transcript],
            });

            await channel.delete();
          });
        });
      }
    }


    if (interaction.isSelectMenu()) {
      if (customId == "reaction-roles") {
        for (let i = 0; i < values.length; i++) {
          const roleId = values[i];
          const hasRole = member.roles.cache.has(roleId);

          switch (hasRole) {
            case true:
              member.roles.remove(roleId);
              break;
            case false:
              member.roles.add(roleId);
              break;
          }
        }
        interaction.reply({ content: "Roles updated.", ephemeral: true });
      }
    }
  },
};
