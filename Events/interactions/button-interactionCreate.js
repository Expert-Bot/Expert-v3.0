const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);

    if (!button) return;

    if (button == undefined) return;

    if (button.cooldown) {
      //Cooldown check
      const currentMemberCooldown = client.cooldowns.get(`${interaction.user.id}-button-${interaction.customId}`);
      if (!currentMemberCooldown) client.cooldowns.set(`${interaction.user.id}-button-${interaction.customId}`, (Date.now() + button.cooldown).toString());
      else if (parseInt(currentMemberCooldown) < Date.now()) client.cooldowns.set(`${interaction.user.id}-button-${interaction.customId}`, (Date.now() + button.cooldown).toString());
      else
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor("Purple").setDescription(`You are on **cooldown try again <t:${Math.floor(parseInt(currentMemberCooldown) / 1000)}:R>**.`)],
          ephemeral: true,
        });
    }

    if (
      button.permission &&
      !interaction.member.permissions.has(button.permission)
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `You don't have the required permissions to use this.`
            )
            .setColor("#f8312f"),
        ],
        ephemeral: true,
      });

    if (button.developer && interaction.user.id !== "YOUR_DISCORD_ID")
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`This button is for developers only.`)
            .setColor("#f8312f"),
        ],
        ephemeral: true,
      });

    button.execute(interaction, client);
  },
};
