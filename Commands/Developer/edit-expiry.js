const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { Code } = require("../../Models/codeSchema");

const ERROR_MESSAGES = {
  CODE_NOT_FOUND: "The code you entered is invalid. Please try again.",
  EXPIRY_EDIT_FAILED:
    "The expiry date of the code could not be updated. Please try again later.",
};

module.exports = {
  adminOnly: true,
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("edit-expiry")
    .setDescription("Only for bot Owner")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to edit")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("days")
        .setDescription("The number of days to add to the expiry date")
        .setRequired(true)
        .addChoices(
          { name: "1 day", value: 1 },
          { name: "3 days", value: 3 },
          { name: "7 days", value: 7 },
          { name: "14 days", value: 14 },
          { name: "30 days", value: 30 },
          { name: "60 days", value: 60 }
        )
    ),

  async execute(interaction) {
    const codeValue = interaction.options.getString("code");
    const daysToAdd = interaction.options.getInteger("days");

    try {
      const code = await Code.findOne({ code: codeValue });
      if (!code) {
        const embed = new EmbedBuilder()
          .setTitle("Edit Expiry Failed")
          .setDescription(ERROR_MESSAGES.CODE_NOT_FOUND)
          .setColor("Red");
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      let newExpiry;
      if (code.redeemedBy && code.redeemedBy.id) {
        newExpiry = new Date(code.expiresAt.getTime() + daysToAdd * 86400000);

        await Code.updateOne(
          { code: codeValue },
          { $set: { expiresAt: newExpiry } }
        );
      } else {
        const length = Object.keys(code)[0];

        await Code.updateOne(
          { code: codeValue },
          { $set: { length: `${daysToAdd} days` } }
        );
      }

      const embed = new EmbedBuilder()
        .setTitle("Expiry Edited")
        .setDescription(
          "The expiry date of the code has been successfully edited."
        )
        .addFields({ name: "Code", value: `${code.code}`, inline: true });

      if (newExpiry) {
        embed.addFields({
          name: "New Expiry",
          value: `<t:${Math.floor(newExpiry.getTime() / 1000)}:R>`,
          inline: true,
        });
      } else {
        embed.addFields({
          name: "New Length",
          value: `${daysToAdd} days`,
          inline: true,
        });
      }

      embed.setTimestamp().setColor("Green");

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);
      const embed = new EmbedBuilder()
        .setTitle("Edit Expiry Failed")
        .setDescription(ERROR_MESSAGES.EXPIRY_EDIT_FAILED)
        .setColor("Red");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};