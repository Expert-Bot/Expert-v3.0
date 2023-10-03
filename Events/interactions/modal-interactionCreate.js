const { InteractionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.type !== InteractionType.ModalSubmit) return;

    const modal = client.modals.get(interaction.customId);

    if (!modal) return;

    if (modal == undefined) return;

    if (
      modal.permission &&
      !interaction.member.permissions.has(modal.permission)
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`You don't have the required permissions to use this.`)
            .setColor("#f8312f"),
        ],
        ephemeral: true,
      });

    if (modal.developer && interaction.user.id !== `903237169722834954`)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`This modal is for developers only.`)
            .setColor("#f8312f"),
        ],
        ephemeral: true,
      });

    modal.execute(interaction, client);

    client.on("messageCreate", message => {
      if (message.content === `<@${client.user.id}>`) {
        message.reply({ content: `**Welcome im ${client.user.tag} My Prefix is ${prefix}**` })
      }
    });
    // 🌙 YamineHz Codes™
  },
};
