const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("remember")
    .setDescription("Make me remember someone.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want me to remember")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The thing you want me to remember about this person")
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
    const description = interaction.options.getString("description");
 
    await db.set(`Remember_${user}_${interaction.guild.id}`, description);
 
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(`Remembered "${description}" for ${user}.`)
      .setTitle("Remembered!")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1039497705753428018/1045730663543885935/verified-blue-check-mark-symbol-logo-trademark-text-transparent-png-821650.png"
      )
      .setTimestamp();
 
    await interaction.reply({ embeds: [embed] });
  },
};
 