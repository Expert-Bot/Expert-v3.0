const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Code } = require("../../Models/codeSchema");

module.exports = {
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("redeem-code")
    .setDescription("Redeem a premium code")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The premium code to redeem")
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;

    const codeValue = interaction.options.getString("code");

    try {
      const code = await Code.findOne({ code: codeValue });

      if (!code) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Code Redemption Failed")
          .setDescription("The code you entered is invalid. Please try again.");
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      if (code.redeemedBy && code.redeemedBy.id) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Code Redemption Failed")
          .setDescription("The code you entered has already been redeemed.");
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const existingCode = await Code.findOne({
        "redeemedBy.id": userId,
      });
      if (existingCode) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Code Redemption Failed")
          .setDescription(
            "You have already redeemed a code. You cannot redeem another one."
          );
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const codeExpiration = new Date();
      const codeLength = code.length;
      const expirationLengths = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
        "14 days": 14,
        "30 days": 30,
        "60 days": 60,
        "90 days": 90,
      };

      const expirationLength =
        expirationLengths[codeLength] || parseInt(codeLength);
      if (isNaN(expirationLength)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Code Redemption Failed")
          .setDescription("The code you entered has an invalid length.");
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
      codeExpiration.setDate(codeExpiration.getDate() + expirationLength);

      const redeemedUser = {
        id: interaction.user.id,
        username: interaction.user.username,
      };

      const redeemedOn = new Date();

      await Code.updateOne(
        { code: codeValue },
        {
          $set: {
            redeemedBy: redeemedUser,
            redeemedOn: redeemedOn,
            expiresAt: codeExpiration,
          },
        }
      );
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Code Redeemed")
        .setDescription("You have successfully redeemed the code.")
        .addFields(
          { name: "Code", value: `${codeValue}`, inline: true },
          { name: "Length", value: `${codeLength}`, inline: true },
          {
            name: "Expires In:",
            value: `<t:${Math.floor(codeExpiration.getTime() / 1000)}:R>`,
            inline: true,
          }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setTitle("Code Redemption Failed")
        .setDescription(
          "An error occurred while redeeming the code. Please try again later."
        )
        .setColor("Red");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
