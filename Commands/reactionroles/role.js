const {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
  } = require("discord.js");
  
  module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
      .setName("role")
      .setDescription("Manage roles of the server or members.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  
      .addSubcommand((subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Add role to a user.")
          .addRoleOption((option) =>
            option
              .setName("role")
              .setDescription("The role you want to add to the user.")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user you want to add the role to.")
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("remove")
          .setDescription("Remove role from a user.")
          .addRoleOption((option) =>
            option
              .setName("role")
              .setDescription("The role you want to remove from the user.")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user you want to remove the role from.")
              .setRequired(true)
          )
      ),
  
    async execute(interaction) {
      if (interaction.options.getSubcommand() === "add") {
        try {
          const member = interaction.options.getMember("user");
          const role = interaction.options.getRole("role");
  
          await member.roles.add(role);
  
          const embed = new EmbedBuilder()
            .setTitle("Role Added")
            .setDescription(`Successfully added the role: ${role} to ${member}`)
            .setColor("0xb9127a")
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL(),
            });
  
          interaction.reply({ embeds: [embed] });
        } catch {
          return interaction.reply({
            content: `I failed at adding that role because it has mod/admin permissions. If it doesn't, contact a developer to report the bug.`,
          });
        }
      }
      if (interaction.options.getSubcommand() === "remove") {
        try {
          const member = interaction.options.getMember("user");
          const role = interaction.options.getRole("role");
  
          await member.roles.remove(role);
  
          const embed = new EmbedBuilder()
            .setTitle("Role Removed")
            .setDescription(
              `Successfully removed the role: ${role} from ${member}`
            )
            .setColor("0xb9127a")
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL(),
            });
  
          interaction.reply({ embeds: [embed] });
        } catch {
          return interaction.reply({
            content: `I failed at removing that role because it has mod/admin permissions. If it doesn't, contact a developer to report the bug.`,
          });
        }
      }
    },
  };