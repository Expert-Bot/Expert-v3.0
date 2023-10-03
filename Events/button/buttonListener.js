const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);

    if (!button) return;

    if (button == undefined) return;

    if (button.permission && !interaction.member.permissions.has(button.permission)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`⛔ | You don't have the required permissions to use this.`).setColor("#f8312f")], ephemeral: true });

    if (button.developer && interaction.user.id !== "CHANGEME") return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`⛔ | This button is for developers only.`).setColor("#f8312f")], ephemeral: true });

    button.execute(interaction, client);
  },
};
