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
const automod_link_check = require("../../Schemas/AllowedLinkChannels");
const Reply = require("../../Utils/Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("allowed-link-channels")
    .setDescription(
      "Allowed Channels in which users can send links by automod v4.0"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription(
          "Enter a channel in which members are allowed to send messages"
        )
        .setRequired(true)
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    let channel1 = options.getChannel("channel");

    let Data = await automod.findOne({ Guild: guild.id });
    if (!Data) {
      Reply(interaction, ":x:", "Please enable automod first", true);
    }
    let automod_link = await automod_link_check.findOne({
      Guild: interaction.guild.id,
    });

    let a;
    if (!automod_link) {
      a = new automod_link_check({
        Guild: interaction.guild.id,
        Channel: channel1.id,
      });
      a.save();
      return Reply(
        interaction,
        ":white_check_mark:",
        "Updated the data of allowed channels",
        true
      );
    } else {
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Change")
          .setEmoji("⚒️")
          .setCustomId("c")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setLabel("Delete")
          .setEmoji("🔧")
          .setCustomId("d")
          .setStyle(ButtonStyle.Danger)
      );
      const e = new EmbedBuilder()
        .setTitle("Allowed Channels")
        .setDescription(
          `The channel you have entered is already created, Would you like to change it to ${channel1} or completely delete it?`
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
              Channel: channel1.id,
            });
            const e3 = new EmbedBuilder()
              .setTitle("Data Delete")
              .setDescription("Successfully deleted the channel data")
              .setColor("Random");
            m.reply({
              content: "Delete",
              embeds: [e3],
              ephemeral: true,
            });
            break;
          case "c":
            automod_link.Channel = channel1.id;
            automod_link.save();

            const e2 = new EmbedBuilder()
              .setTitle("Data Changed")
              .setDescription("Successfully changed the channel data")
              .setColor("Random");
            m.reply({
              content: "Changed/Recreated",
              embeds: [e2],
              ephemeral: true,
            });
            break;
        }
      });
    }
  },
};
