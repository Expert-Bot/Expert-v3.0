const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("getID")
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  async execute(interaction) {
    const { targetId } = interaction;

    const embed = new EmbedBuilder();

    await interaction.reply({
      embeds: [
        embed
          .setTitle(`${interaction.targetUser.username}'s ID`)
          .setDescription(`This user's ID is **${targetId}**.`)
          .setColor("0x2f3136")
          .setTimestamp()
      ],
      ephemeral: true
    })
  }
}