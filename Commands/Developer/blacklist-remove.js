const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const blacklistDB = require("../../Schemas/blacklistSchema")

module.exports = {
  adminOnly: true,
  data: new SlashCommandBuilder()
    .setName("blacklist-remove")
    .setDescription("Removes a user from the blacklist")
    .addStringOption(option => option.setName("user").setDescription("The user to remove from the blacklist").setRequired(true)),
  async execute(interaction, client) {
    const user = interaction.options.getString("user")

    const embed = new EmbedBuilder()
      .setTitle("Blacklist")
      .setColor("2B2D31")
      .setDescription("Successfully removed the user from the blacklist")

    try {
      await blacklistDB.findOneAndDelete({ userId: user })
      interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error(error)
    }
  }
}