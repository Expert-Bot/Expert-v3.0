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
const UserVerifier = require("../../Schemas/UserVerifier");
const welcome = require("../../Schemas/welcome");
const Reply = require("../../Utils/Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("user-verifier")
    .setDescription(
      "Uses advanced 4 Layer verification to verify if the users are safe or not"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addChannelOption((options) =>
      options
        .setName("log-channel")
        .setDescription(
          "Enter a channel where all the logs should be sent(Should be different from automod logs channel)"
        )
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const channel = options.getChannel("log-channel");
    const Data1 = await AutoMod.findOne({ Guild: guild.id });
    if (!Data1 || !Data1.AntiAltAccount == true) {
      return Reply(
        interaction,
        "You need Automod or AntiAltAccount system enabled to use this command, use `/automod` to enable automod and AntiAltAccount system",
        ":x:",
        true
      );
    } else if (channel.id == Data1.LogChannel) {
      return Reply(
        interaction,
        "The channel cannot be same as automod Log Channel id, Please change the channel",
        ":x:",
        true
      );
    }

    const Data2 = await welcome.findOne({ Guild: guild.id });
    if (!Data2) {
      return Reply(
        interaction,
        "You need autorole system enabled to use this command, use `/autorole` to enable autorole",
        ":x:",
        true
      );
    }
    const Data3 = await UserVerifier.findOne({ Guild: guild.id });
    if (!Data3) {
      let dat;
      dat = new UserVerifier({
        Guild: guild.id,
        VerifierLogChannel: channel.id,
      });
      dat.save();
      return Reply(
        interaction,
        "Successfully enabled UserVerifier",
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
        .setTitle("Disable UserVerifier?")
        .setDescription(
          "`User Verifier` is already enabled!, would you like to disable it?. Keep in mind that UserVerifier is an advanced way of verifying the users and essentially keeps your discord server safe, You can enable it anytime in the near future!"
        )
        .setColor("Random");
      const message = await interaction.reply({
        content: "Disable/Delete?",
        embeds: [e],
        components: [buttons],
        ephemeral: true,
      });
      const col = await message.createMessageComponentCollector();
      col.on("collect", async (m) => {
        switch (m.customId) {
          case "v":
            const Embed = new EmbedBuilder()
              .setTitle("UserVerifier")
              .setDescription(
                "Successfully disabled UserVerifier, Please run the command again if you want to enable it again"
              )
              .setColor("DarkRed");
            m.reply({ content: "Success", embeds: [Embed] }).then(async () => {
              await UserVerifier.findOneAndDelete({ Guild: m.guild.id });
            });
        }
      });
    }
  },
};
