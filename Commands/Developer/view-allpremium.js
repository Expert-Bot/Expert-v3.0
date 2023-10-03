const { Code } = require("../../Models/codeSchema");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  adminOnly: true,
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("vieww-allpremium")
    .setDescription("Only for Bot Owner"),
  async execute(interaction) {
    const codes = await Code.find({ "redeemedBy.id": { $ne: null } });
    const users = codes.map((code) => code.redeemedBy);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Premium Codes")
      .setDescription("List of users who have redeemed a premium code:")
      .addFields(
        users.map((user) => {
          return {
            name: user.username,
            value: `<@${user.id}>`,
            inline: true,
          };
        })
      )
      .setFooter({ text: "Premium Codes" });

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
