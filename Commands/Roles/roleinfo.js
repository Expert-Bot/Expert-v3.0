const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-info")
    .setDescription("Get the information of a role")
    .addRoleOption(opt => opt.setName("role").setDescription("The role to get the information").setRequired(true)
    ),
  async execute(interaction, client) {
    const role = interaction.options.getRole('role') //gets the mentioned role

    if (!role || !role.id) return interaction.reply({ content: "No role found." }) //if the role doesn't exist the bot returns this message.

    const embed = new EmbedBuilder()
      .setColor('Blurple') //you can set the color of the role or any color you want
      .setTitle("Role information | " + role.name) //name of the role
      .addFields({ name: "Role id", value: `${role.id}` }) //id of the role
      .addFields({ name: "Role color", value: `${role.hexColor}` }) //color of the role
      .setTimestamp()
      .setFooter({ text: " Bot (Role info basic command)" }) //Footer

    interaction.reply({ embeds: [embed] }) //sends the embed
  }
}