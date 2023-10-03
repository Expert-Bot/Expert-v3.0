const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("getPixelatedAvatar")
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  async execute(interaction, client) {
    const { targetUser } = interaction;

    let avatarUrl = targetUser.avatarURL({ size: 512, extension: "jpg" });
    let canvas = `https://some-random-api.ml/canvas/pixelate?avatar=${avatarUrl}`;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("0x2f3136")
          .setTimestamp()
          .setImage(canvas)
          .setTitle(`${interaction.targetUser.username}'s Pixelated Avatar`)
      ],
      ephemeral: true
    });
  },
};