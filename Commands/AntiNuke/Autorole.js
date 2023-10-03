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
const welcome = require("../../Schemas/welcome");
const Reply = require("../../Utils/Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Automatic adds the role you select when a user/bot joins")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription(
          "Enter a channel where verification panel should be sent"
        )
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption((options) =>
      options
        .setName("verified-user-role")
        .setDescription("Role for verified users!")
        .setRequired(true)
    )
    .addRoleOption((options) =>
      options
        .setName("unverified-user-role")
        .setDescription("Add a role for the unverified users!")
        .setRequired(true)
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const roles = options.getRole("verified-user-role");
    const roles2 = options.getRole("unverified-user-role");
    const channel = options.getChannel("channel");

    let Data = await welcome.findOne({ Guild: guild.id });
    let dat;

    if (!Data) {
      dat = new welcome({
        Guild: guild.id,
        UnverifiedUserRole: roles2.id,
        VerifiedUserRole: roles.id,
      });
      dat.save();
    } else {
      Data.UnverifiedUserRole = roles2.id;
      Data.VerifiedUserRole = roles.id;
      Data.save();
    }

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Verify")
        .setEmoji("✅")
        .setCustomId("v")
        .setStyle(ButtonStyle.Success)
    );

    const e = new EmbedBuilder()
      .setTitle("Verify")
      .setDescription("Verify your self by clicking the button below")
      .setColor("Random");
    const message = await channel.send({
      content: "Verify your self",
      embeds: [e],
      components: [buttons],
    });
    const col = await message.createMessageComponentCollector();
    col.on("collect", async (m) => {
      switch (m.customId) {
        case "v":
          const data = await welcome.findOne({ Guild: m.guild.id });
          const e = new EmbedBuilder()
            .setTitle("Verified")
            .setDescription("You have been verified")
            .setColor("Green");
          m.reply({ content: "Verified", embeds: [e], ephemeral: true });
          m.member.roles.add(data.VerifiedUserRole);
          setTimeout(() => {
            m.member.roles.remove(data.UnverifiedUserRole);
          }, 3000);
      }
    });
    Reply(
      interaction,
      ":white_check_mark:",
      `Added the following roles - ${roles} and ${roles2}`,
      true
    );
  },
};
