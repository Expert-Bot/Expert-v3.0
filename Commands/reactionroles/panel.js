const rrSchema = require("../../Models/ReactionRoles");
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

module.exports = {
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription(" reaction role panel.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const { options, guildId, guild, channel } = interaction;

    try {
      const data = await rrSchema.findOne({ GuildID: guildId });
      let length;
      length = 1
      if (!data.roles.length > 0)
        return interaction.reply({ content: "This server does not have any data.", ephemeral: true });

      const panelEmbed = new EmbedBuilder()
        .setDescription("Select a role below to receive updates")
        .setColor("#235ee7")
        .setImage("https://media.discordapp.net/attachments/703532025771982899/1110509465830170714/IMG_4381.gif?width=547&height=290")
      const options = data.roles.map(x => {
        const role = guild.roles.cache.get(x.roleId);

        return {
          label: role.name,
          value: role.id,
          description: x.roleDescription,
          emoji: x.roleEmoji || undefined
        };
      });

      const menuComponents = [
        new ActionRowBuilder().addComponents(
          new SelectMenuBuilder()
            .setCustomId('reaction-roles')
            .setMaxValues(options.length)
            .addOptions(options),
        ),
      ];

      channel.send({ embeds: [panelEmbed], components: menuComponents });

      return interaction.reply({ content: "Succesfully sent your panel.", ephemeral: true });
    } catch (err) {
      console.log(err);
    }
  }
}