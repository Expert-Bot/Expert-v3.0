const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const suggest = require("../../Schemas/Suggestion");
const Reply = require("../../Systems/Reply");
const SuggData = require("../../Schemas/SuggData");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggests")
    .setDescription("Suggest something....")
    .addStringOption((options) =>
      options
        .setName("type")
        .setDescription("Set the type of suggestion")
        .addChoices(
          { name: "Youtube Video", value: "Youtube Video" },
          { name: "Discord", value: "Discord" },
          { name: "Twitter", value: "Twitter" },
          { name: "Facebook", value: "Facebook" },
          { name: "Google", value: "Google" },
          { name: "Patreon", value: "Patreon" },
          { name: "Other", value: "Other" }
        )
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("description")
        .setDescription("Enter the description")
        .setRequired(true)
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    const { guild, options, user } = interaction;
    let type = options.getString("type");
    let description = options.getString("description");
    let Data = await suggest.findOne({ Guild: guild.id });
    if (!Data) {
      Reply(
        interaction,
        ":x:",
        "This server doesn't have suggestion enabled :(",
        true
      );
    }
    if (Data) {
      const sugg = new EmbedBuilder()
        .setAuthor({
          name: "Suggestion",
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(`${user.username}'s suggestion`)
        .setColor("Random")
        .setDescription(`**Suggestion**\n${description}`)
        .addFields(
          { name: "**Type:**", value: `${type}`, inline: true },
          { name: "**Status:**", value: "Pending...", inline: true }
        );
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("suggest-accept")
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("suggest-decline")
          .setLabel("Decline")
          .setStyle(ButtonStyle.Danger)
      );
      const Channel = guild.channels.cache.get(Data.Channel);
      const M = await Channel.send({
        embeds: [sugg],
        components: [buttons],
        fetchReply: true,
      });
      Reply(interaction, ":white_check_mark:", "Sent your suggestion", true);
      const D = await SuggData.findOne({
        Guild: guild.id,
        User: user.id,
      });
      if (!D) {
        await SuggData.create({
          Guild: guild.id,
          MessageID: M.id,
          Details: [
            {
              MemberID: user.id,
              Suggestion: description,
            },
          ],
        });
      }
    }
  },
};
