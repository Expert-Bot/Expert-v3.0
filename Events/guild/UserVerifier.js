// Import required modules and dependencies
const verifier = require("../../Schemas/UserVerifier");
const antiAlt = require("../../Schemas/AntiAlt");
const automod = require("../../Schemas/automod");
const axios = require("axios");
const config = require("../../config.json");
const moment = require("moment");
const BadWordsFilter = require("bad-words");
const filter = new BadWordsFilter();
const apiUser = config.Setup.SIGHT_ENGINE_APIUSER;
const apiKey = config.Setup.SIGHT_ENGINE_APIKEY;
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  UserFlags,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  once: false,

  async execute(member) {
    // CHECKER
    if (!member.guild || member.user.bot) return;

    // Get the user's avatar URL
    const avatarUrl = await member.user.displayAvatarURL({
      size: 1024,
      dynamic: false,
    });

    // Retrieve verification data, anti-alt data, and automod settings
    const verification_data = await verifier.findOne({
      Guild: member.guild.id,
    });

    if (!verification_data || !verification_data.VerifierLogChannel) return;

    const AltHole = await antiAlt.findOne({
      Guild: member.guild.id,
      User: member.user.id,
    });
    const AutoMod = await automod.findOne({ Guild: member.guild.id });

    const channel = member.guild.channels.cache.get(
      verification_data.VerifierLogChannel
    );

    if (!channel) return;

    // Check for missing data or if the user is an alt account
    if (!verification_data || !channel || AltHole) return;

    const LogEmbed = new EmbedBuilder()
      .setTitle("User Kicked")
      .setColor("Green");

    // USER-VERIFICATION LAYER 1

    // LAYER 1: Anti-Unverified Bot
    try {
      if (AutoMod && !AutoMod.AntiAltAccount) {
        const timeSpan = ms("20 days");
        const k = new EmbedBuilder()
          .setTitle("__Kicked__")
          .setDescription("You were detected as an alt account")
          .setColor("Yellow")
          .setFooter({
            text: "If you are not an alt, your account must be older than 20 days.",
          })
          .setThumbnail(member.displayAvatarURL({ dynamic: true }));

        const createdAt = new Date(member.user.createdAt).getTime();
        const difference = Date.now() - createdAt;

        if (difference < timeSpan) {
          member.send({ embeds: [k] }).then(() => {
            member.kick(
              "Kicked because the user has been suspected as an alt account!"
            );
          });

          const logChannel = client.channels.cache.get(requireDB.LogChannel);

          logChannel.send({
            content:
              "If you think this is a mistake, you can run `/antialtusersallow` command to allow the user to join the server",
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `\`TAG-<@${member.user.tag}>, ID-${member.user.id}\` has been kicked from the server because the member is suspected as an alt account`
                ),
            ],
          });
        }
      }
    } catch {}

    // USER-VERIFICATION LAYER 2

    // Inappropriate DisplayName Checker
    const embed = new EmbedBuilder()
      .setTitle("Inappropriate Name Detected")
      .setDescription(
        "Our system has detected that your **displayName** contains inappropriate words, and you have been kicked. Please change your username and join again."
      )
      .setColor("Red");

    const user = member.user;
    const username = user.displayName;

    if (filter.isProfane(username)) {
      member
        .send({
          content:
            "You have been kicked by the bot because our Advanced User-Verifier system has detected that your **displayName** contains inappropriate words.",
          embeds: [embed],
        })
        .then(() => {
          member.kick({ reason: "Inappropriate Name Detected" }).then(() => {
            channel.send({
              content: "New User Kicked",
              embeds: [
                LogEmbed.setDescription(
                  `\`TAG-${member.user.tag}, ID-${member.user.id}\` has been kicked from the server because the user's **displayName** contained inappropriate words`
                ),
              ],
            });
          });
        });
      return;
    }

    // USER-VERIFICATION LAYER 3

    // User Avatar Appropriateness checker
    if (avatarUrl) {
      const response = await axios.get(
        "https://api.sightengine.com/1.0/check.json",
        {
          params: {
            url: avatarUrl,
            models: "nudity-2.0",
            api_user: `${apiUser}`,
            api_secret: `${apiKey}`,
          },
        }
      );

      const { nudity } = response.data;

      if (
        nudity.sexual_activity > 0.5 ||
        nudity.sexual_display > 0.5 ||
        nudity.erotica > 0.5
      ) {
        const embed2 = new EmbedBuilder()
          .setTitle("Inappropriate Avatar Detected")
          .setDescription(
            "Our system has detected that your Avatar contains inappropriate content, and you have been kicked. Please change your Avatar and join again."
          )
          .setColor("Red");

        channel.send({
          content: "New User Kicked",
          embeds: [
            LogEmbed.setDescription(
              `\`TAG-${member.user.tag}, ID-${member.user.id}\` has been kicked from the server because the user's account contained an inappropriate avatar.`
            ),
          ],
        });

        member
          .send({
            content:
              "You have been kicked by the bot because our Advanced User-Verifier system has detected that your account contains an inappropriate avatar.",
            embeds: [embed2],
          })
          .then(() => {
            member.kick({ Reason: "Kicked for inappropriate avatar" });
          });
        return;
      }
    }

    // Embed for layer 3
    // Account Risk Checker
    const DateCreatedInSeconds = parseInt(member.user.createdAt / 1000);
    const DateCreated = new Date(member.user.createdAt);
    const formattedDate = DateCreated.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const hasHypeSquadBadge = member.user.flags.any([
      UserFlags.HypeSquadOnlineHouse1,
      UserFlags.HypeSquadOnlineHouse2,
      UserFlags.HypeSquadOnlineHouse3,
      UserFlags.Hypesquad,
    ]);

    const YearsAgo = moment().subtract(2, "years").unix();
    const YearAgo = moment().subtract(2, "year").unix();
    const MonthsAgo = moment().subtract(2, "months").unix();
    const WeeksAgo = moment().subtract(2, "weeks").unix();
    const DaysAgo = moment().subtract(2, "days").unix();

    const Risk = await RiskCalculator(
      YearsAgo,
      YearAgo,
      MonthsAgo,
      WeeksAgo,
      DaysAgo,
      DateCreatedInSeconds,
      member,
      hasHypeSquadBadge
    );

    const embedLayer3 = new EmbedBuilder()
      .setAuthor({
        name: `${member.user.displayName} | ${member.id}`,
        iconURL: member.displayAvatarURL({ dynamic: true }),
      })
      .setTitle("Layer 3 Verification")
      .setDescription(
        "**UserVerifier has detected a new user has joined the server and has published some results for admins and mods!**"
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "Display Name",
          value: `| *${member.user.displayName}*`,
        },
        {
          name: "User Mention",
          value: ` *${member}*`,
        },
        {
          name: "Avatar",
          value: `| *${member.user.avatar ? "Present" : "Missing"}*`,
        },
        {
          name: "HypeSquad Badge",
          value: `| *${hasHypeSquadBadge ? "Present" : "Missing"}*`,
        },
        {
          name: "Date Created",
          value: `| <t:${formattedDate}:D>`,
        },
        {
          name: "RiskLevel",
          value: `| <t:${Risk.RiskLevel}:D>`,
        }
      )
      .setColor(Risk.color)
      .setTimestamp();

    // Buttons if RiskLevel is too high
    if (
      Risk.RiskLevel == "Very Extreme" ||
      Risk.RiskLevel == "Extreme" ||
      Risk.RiskLevel == "High"
    ) {
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Kick")
          .setEmoji("⚒️")
          .setCustomId("k")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setLabel("Ban")
          .setEmoji("🔨")
          .setCustomId("b")
          .setStyle(ButtonStyle.Danger)
      );

      const message = await channel.send({
        content: "User Results",
        embeds: [embedLayer3],
        components: [buttons],
      });

      const col = message.createMessageComponentCollector();
      col.on("collect", async (m) => {
        if (
          !m.message.member.permissions.has(PermissionFlagsBits.KickMembers)
        ) {
          return m.reply({
            content: "You don't have permissions to kick/ban the user",
            ephemeral: true,
          });
        }

        const Embed123 = new EmbedBuilder()
          .setTitle("Kicked/Banned")
          .setColor("Green");

        switch (m.customId) {
          case "k":
            if (!member)
              return m.reply({
                content: "This member doesn't exist",
                ephemeral: true,
              });

            member
              .send({
                content: `You have been kicked from ${member.guild.name}`,
                embeds: [
                  Embed123.setDescription(
                    `You have been kicked from the server \`${member.guild.name}\` for your RiskLevel: **${Risk.RiskLevel}**. Please contact the owner if you think this is a mistake!`
                  ),
                ],
              })
              .then(() => {
                member.kick({
                  reason: `Kicked by admins for RiskLevel: ${Risk.RiskLevel}`,
                });
                m.reply({ content: `Kicked ${member}`, ephemeral: true });
              });
            break;

          case "b":
            if (!member)
              return m.reply({ content: "This member doesn't exist" });

            member
              .send({
                content: `You have been banned from ${member.guild.name}`,
                embeds: [
                  Embed123.setDescription(
                    `You have been banned from the server \`${member.guild.name}\` for your RiskLevel: **${Risk.RiskLevel}**. Please contact the owner if you think this is a mistake!`
                  ),
                ],
              })
              .then(() => {
                member.ban({
                  reason: `Banned by admins for RiskLevel: ${Risk.RiskLevel}`,
                });
                m.reply({ content: `Kicked ${member}`, ephemeral: true });
              });
        }
      });
    } else {
      await channel.send({
        content: "User Results",
        embeds: [embedLayer3],
      });
    }

    // USER VERIFICATION LAYER 4

    if (avatarUrl) {
      // Inappropriate Signs Detection for user Avatar
      const response1 = await axios.get(
        "https://api.sightengine.com/1.0/check.json",
        {
          params: {
            url: avatarUrl,
            models: "offensive",
            api_user: `${apiUser}`,
            api_secret: `${apiKey}`,
          },
        }
      );

      const { offensive } = response1.data;

      // Check if the overall probability of offensive content is above a threshold (e.g., 0.5)
      if (offensive.prob > 0.5) {
        const embed2 = new EmbedBuilder()
          .setTitle("Inappropriate Avatar Detected")
          .setDescription(
            "Our system has detected that your Avatar contains offensive **signs**, and you have been kicked. Please change your Avatar and join again."
          )
          .setColor("Red");

        channel.send({
          content: "New User Kicked",
          embeds: [
            LogEmbed.setDescription(
              `\`TAG-${member.user.tag}, ID-${member.user.id}\` has been kicked from the server because the user's account contained an inappropriate avatar with offensive **signs**.`
            ),
          ],
        });

        member
          .send({
            content:
              "You have been kicked by the bot because our Advanced User-Verifier system has detected that your account contains an inappropriate avatar with offensive **signs**.",
            embeds: [embed2],
          })
          .then(() => {
            member.kick({ Reason: "Kicked for inappropriate avatar" });
          });
        return;
      }

      // Inappropriate Text/Social/Link Detection for user Avatar
      const response2 = await axios.get(
        "https://api.sightengine.com/1.0/check.json",
        {
          params: {
            url: avatarUrl,
            models: "text-content",
            api_user: `${apiUser}`,
            api_secret: `${apiKey}`,
          },
        }
      );

      const { text } = response2.data;

      if (
        text.profanity.length > 0 ||
        text.personal.length > 0 ||
        text.link.length > 0
      ) {
        const embed2 = new EmbedBuilder()
          .setTitle("Inappropriate Avatar Detected")
          .setDescription(
            "Our system has detected that your Avatar contains inappropriate **words**, and you have been kicked. Please change your Avatar and join again."
          )
          .setColor("Red");

        channel.send({
          content: "New User Kicked",
          embeds: [
            LogEmbed.setDescription(
              `\`TAG-${member.user.tag}, ID-${member.user.id}\` has been kicked from the server because the user's account contained an inappropriate avatar that had inappropriate **words**.`
            ),
          ],
        });

        member
          .send({
            content:
              "You have been kicked by the bot because our Advanced User-Verifier system has detected that your account contains an inappropriate avatar with inappropriate **words**.",
            embeds: [embed2],
          })
          .then(() => {
            member.kick({ Reason: "Kicked for inappropriate avatar" });
          });
        return;
      }
    }
  },
};
