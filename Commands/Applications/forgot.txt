const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("forget")
    .setDescription("Makes me forget about a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to forget about")
        .setRequired(true)
    ),
 
  async execute(interaction) {
    const embed1 = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "You dont have permission to make me remember thing about someone on this server."
      )
      .setTitle("Error Detected!")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1039497705753428018/1046445745731031040/pngegg.png"
      )
      .setTimestamp();
 
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return interaction.reply({ embeds: [embed1], ephemeral: true });
 
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
      await db.delete(`Remember_${user}_${interaction.guild.id}`);
 
      const embed = new EmbedBuilder()
        .setColor("DarkPurple")
        .setDescription(`I forgot "${remuser}" about ${user}.`)
        .setTitle("Forgot!")
        .setTimestamp();
 
      await interaction.reply({ embeds: [embed] });
    }
  },
};
 