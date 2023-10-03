const rrSchema = require("../../Models/ReactionRoles");
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Add custom reaction role.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option =>
      option.setName("role")
        .setDescription("Role to be assigned")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("description")
        .setDescription("Description of the role.")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("emoji")
        .setDescription("Emoji for the role.")
        .setRequired(false)
    ),
  async execute(interaction) {
    const { options, guildId, member } = interaction;

    const role = options.getRole("role");
    const description = options.getString("description");
    const emoji = options.getString("emoji");

    try {
      if (role.position >= member.roles.highest.position)
        return interaction.reply({ content: "I don't have permissions for that.", ephemeral: true });

      const data = await rrSchema.findOne({ GuildID: guildId });

      const newRole = {
        roleId: role.id,
        roleDescription: description || "No description.",
        roleEmoji: emoji || "",
      }

      if (data) {
        let roleData = data.roles.find((x) => x.roleId === role.id);

        if (roleData) {
          roleData = newRole; // Corrected this line to assign newRole
        } else {
          data.roles = [...data.roles, newRole]
        }

        await data.save();
      } else {
        await rrSchema.create({
          GuildID: guildId,
          roles: [newRole], // Wrap newRole in an array
        });
      }

      return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Created new role **${role.name}**`).setColor("#235ee7").setTimestamp()], ephemeral: true });

    } catch (err) {
      console.log(err);
    }
  }
}
