const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("remembers-check")
    .setDescription("See what i remember about a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to check if i remember")
        .setRequired(true)
    ),
 
  async execute(interaction) {
    const author = interaction.user;
    const user = interaction.options.getUser("user");
 
    const remuser = await db.get(`Remember_${user}_${interaction.guild.id}`);
 
    if (remuser == null) {
      const embed1 = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`I don't remember anything about ${user}.`)
        .setTitle("Error Detected!")
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/1039497705753428018/1046445745731031040/pngegg.png"
        )
        .setTimestamp();
 
      await interaction.reply({ embeds: [embed1], ephemeral: true });
    } else {
      const embed = new EmbedBuilder()
        .setColor("DarkPurple")
        .setDescription(`I remember this about ${user}: \n${remuser}`)
        .setTitle("Here's what i remember:")
        .setTimestamp();
 
      await interaction.reply({ embeds: [embed] });
    }
  },
};
 