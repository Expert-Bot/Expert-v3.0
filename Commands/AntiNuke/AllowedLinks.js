const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const automod = require("../../Schemas/automod");
const automod_link_check = require("../../Schemas/AntiAllowedLinks");
const Reply = require("../../Utils/Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("allowed-links")
    .setDescription("Allowed links by automod v4.0")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((options) =>
      options
        .setName("link1")
        .setDescription("Enter the first link!")
        .setRequired(true)
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    let link1 = options.getString("link1");
    if (!link1.startsWith("https://") || !link1.includes("www.")) {
      return Reply(
        interaction,
        ":x:",
        "This link should contain `https://`, `www.`",
        true
      );
    }

    let Data = await automod.findOne({ Guild: guild.id });
    if (!Data) {
      Reply(interaction, ":x:", "Please enable automod first", true);
    }
    let automod_link = await automod_link_check.findOne({
      Guild: interaction.guild.id,
      Link: link1,
    });
    let a;
    if (!automod_link) {
      a = new automod_link_check({
        Guild: interaction.guild.id,
        Link: link1,
      });
      a.save();
      return Reply(
        interaction,
        ":white_check_mark:",
        "Updated the data of allowed links",
        true
      );
    } else {
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Delete")
          .setEmoji("⚒️")
          .setCustomId("d")
          .setStyle(ButtonStyle.Danger)
      );
      const e = new EmbedBuilder()
        .setTitle("Allowed Links")
        .setDescription(
          "The link you have entered is already created, Would you like to delete it?"
        )
        .setColor("Random");
      const message = await interaction.reply({
        content: "An error occurred while saving the data",
        embeds: [e],
        components: [buttons],
        ephemeral: true,
      });
      const col = await message.createMessageComponentCollector();
      col.on("collect", async (m) => {
        if (!m.member.permissions.has(PermissionFlagsBits.KickMembers))
          return m.reply({
            content: "You don't have permission to perform this action",
            ephemeral: true,
          });
        switch (m.customId) {
          case "d":
            let deldata = await automod_link.deleteOne({
              Guild: m.guild.id,
              Link: link1,
            });

            const e2 = new EmbedBuilder()
              .setTitle("Data Deleted")
              .setDescription("Successfully deleted the link data")
              .setColor("Random");
            m.reply({
              content: "Deleted",
              embeds: [e2],
              ephemeral: true,
            });
            break;
        }
      });
    }
  },
};
