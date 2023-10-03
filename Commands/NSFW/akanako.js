const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
voteRequired: true,
  data: new SlashCommandBuilder()
    .setName("akaneko")
    .setDescription("akaneko"),
  // If you want to use the prefix system, you can provide information here.
  async execute(interaction) {
    interaction.reply(`This command is for use with a prefix system.\`\`\`ini\n[You can use this via noprefix (akaneko).]\`\`\``);
  }
};
