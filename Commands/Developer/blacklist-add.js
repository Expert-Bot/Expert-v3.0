const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const blacklistDB = require("../../Schemas/blacklistSchema")

module.exports = {
  adminOnly: true,
  data: new SlashCommandBuilder()
    .setName("blacklist-add")
    .setDescription("Adds a user to the blacklist")
    .addStringOption(option => option.setName("userid").setDescription("The user to add to the blacklist").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("The reason for the blacklist").setRequired(false)),
  async execute(interaction, client) {
    const useridOption = interaction.options.getString("userid")
    const reasonOption = interaction.options.getString("reason") || "No reason provided";
    const errorArray = [];

    const blacklist = await blacklistDB.findOne({ userId: useridOption });

    const removeButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Remove")
          .setStyle(ButtonStyle.Danger)
          .setCustomId("remove")
      )

    const embed = new EmbedBuilder()
      .setTitle("BlackList")
      .setColor("2B2D31")
      .setDescription(`Successfully added user to blacklist with the reason: ${reasonOption}`);

    if (blacklist) {
      errorArray.push("That user is already blacklisted")
    }
    if (errorArray.length) {
      const errorEmbed = new EmbedBuilder()
        .setDescription(`<:incorrect:1087980863859462195> There was an error when adding user to blacklist.\nError(s):\n ${errorArray.join(`\n`)}`)
        .setColor("2B2D31");
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      return;
    } else {
      await blacklistDB.create({ userId: useridOption, reason: reasonOption });

      await interaction.reply({ embeds: [embed], components: [removeButton] });

      const removeEmbed = new EmbedBuilder()
        .setTitle("BlackList")
        .setDescription("Successfully removed user from blacklist")
        .setColor("2B2D31")

      const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

      collector.on("collect", async i => {
        if (i.customId === "remove") {
          if (i.user.id !== interaction.user.id) {
            return await i.reply({ content: `Only ${interaction.client.user.username} can use this command!`, ephemeral: true })
          }
          await blacklistDB.deleteOne({ userId: useridOption });
          await i.update({ embeds: [removeEmbed], components: [] });
        }
      });

      collector.on("end", collected => {
        console.log(`Collected ${collected.size} interactions.`);
      });

    }

  }
}