const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const AutoMod = require("../../Schemas/automod");
const BlockedKeyWords = require("../../Schemas/BlockedKeywords");
const Reply = require("../../Utils/Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("blocked-keywords")
    .setDescription("Block a keyword from your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((options) =>
      options
        .setName("keyword")
        .setDescription(
          "Enter a keyword that should be blocked as soon as sent"
        )
        .setMaxLength(96)
        .setRequired(true)
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const keyword = await options.getString("keyword");
    const Data1 = await AutoMod.findOne({ Guild: guild.id });
    if (!Data1) {
      return Reply(
        interaction,
        "You need Automod system enabled to use this command, use `/automod` to enable automod",
        ":x:",
        true
      );
    }

    const Data3 = await BlockedKeyWords.findOne({
      Guild: guild.id,
      KeyWord: keyword,
    });
    if (!Data3) {
      let dat;
      dat = new BlockedKeyWords({
        Guild: guild.id,
        KeyWord: keyword,
      });
      dat.save();
      return Reply(
        interaction,
        `Successfully blocked the keyword ${keyword}, Now all message containing the word will be blocked`,
        ":white_check_mark:",
        true
      );
    } else {
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Disable")
          .setEmoji("⚒️")
          .setCustomId("v")
          .setStyle(ButtonStyle.Danger)
      );

      const e = new EmbedBuilder()
        .setTitle(`Unblock the keyword ${keyword}?`)
        .setDescription(
          `${keyword} is already blocked, would you like to unblock this keyword?`
        )
        .setColor("Random");
      const message = await interaction.reply({
        content: "UnBlock/Block?",
        embeds: [e],
        components: [buttons],
        ephemeral: true,
      });
      const col = await message.createMessageComponentCollector();
      col.on("collect", async (m) => {
        switch (m.customId) {
          case "v":
            const Embed = new EmbedBuilder()
              .setTitle(`UnBlocked ${keyword}`)
              .setDescription(
                `Successfully unblocked ${keyword}, You run this command again if you want to block this keyword again!`
              )
              .setColor("DarkRed");
            m.reply({ content: "Success", embeds: [Embed] }).then(async () => {
              await BlockedKeyWords.findOneAndDelete({
                Guild: m.guild.id,
                KeyWord: keyword,
              });
            });
        }
      });
    }
  },
};
