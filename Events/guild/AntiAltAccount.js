const { Client, EmbedBuilder } = require("discord.js");
const ms = require("ms");
const automod = require("../../Schemas/automod");
const antiAlt = require("../../Schemas/AntiAlt");

module.exports = {
  name: "guildMemberAdd",
  /**
 * 

 * @param {Client} client 
 */
  async execute(member, client) {
    if (!member.guild) return;
    if (member.user.bot) return;

    const guild = member.guild;

    let requireDB = await automod.findOne({ Guild: guild.id });
    const AltHole = await antiAlt.findOne({
      Guild: guild.id,
      User: member.user.id,
    });

    if (!AltHole) {
      if (!requireDB) return;
      if (requireDB.AntiAltAccount === false) return;
      const timeSpan = ms("20 days");

      const k = new EmbedBuilder()
        .setTitle("__Kicked__")
        .setDescription("You were detected as an alt account")
        .setColor("Yellow")
        .setFooter({
          text: "If you are not an alt than your account must be older than 20 days",
        })
        .setThumbnail(member.displayAvatarURL({ dynamic: true }));
      const createdAt = new Date(member.user.createdAt).getTime();
      const difference = Date.now() - createdAt;
      if (difference < timeSpan) {
        member.send({ embeds: [k] }).then(() => {
          member.kick(
            "Kicked because the user has been suspected as an alt account!"
          );
        });
      } else return;

      const logChannel = client.channels.cache.get(requireDB.LogChannel);

      logChannel.send({
        content:
          "If you think this is a mistake then you can run `/antialtusersallow` command to allow the user to join the server",
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `\`TAG-<@${member.user.tag}>, ID-${member.user.id}\` has been kicked from the server because the member is suspected as an alt account`
            ),
        ],
      });
    } else {
      return;
    }
  },
};
