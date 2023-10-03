const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Code } = require("../../Models/codeSchema");

const MESSAGES = {
  USER_NOT_PREMIUM: "The user is not currently a premium user.",
};

module.exports = {
  adminOnly: false,
  premiumOnly: true,
  data: new SlashCommandBuilder()
    .setName("premium-status")
    .setDescription("Check if a user is a premium user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check the premium status of")
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUserId =
      interaction.options.getUser("user")?.id || interaction.user.id;

    const code = await Code.findOne({ "redeemedBy.id": targetUserId });
    if (!code) {
      const embed = new EmbedBuilder()
        .setTitle("User Not Premium")
        .setDescription(MESSAGES.USER_NOT_PREMIUM)
        .setColor("Red");
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const activatedOn = `<t:${Math.floor(code.redeemedOn.getTime() / 1000)}:R>`;
    const expiresAt = `<t:${Math.floor(code.expiresAt.getTime() / 1000)}:R>`;
    const embed = new EmbedBuilder()
      .setTitle("User Premium Status")
      .setDescription(
        `The user <@${targetUserId}> is currently a premium user.`
      )
      .addFields(
        { name: "Code", value: code.code, inline: true },
        { name: "Activated On", value: activatedOn, inline: true },
        { name: "Expires At", value: expiresAt, inline: true }
      )
      .setColor("Green")
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
