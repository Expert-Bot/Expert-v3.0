const { UserFlags, EmbedBuilder } = require("discord.js");
const automod = require("../../Schemas/automod");
const antiunverfiedbot = require("../../Schemas/AntiUnverifiedBot");

module.exports = {
  name: "guildMemberAdd",
  once: false,

  async execute(member) {
    if (!member.user.bot) return;
    const automoder = await automod.findOne({ guildId: member.guild.id });
    const antibot = await antiunverfiedbot.findOne({
      Guild: member.guild.id,
      Bot: member.user.id,
    });
    if (!antibot) {
      if (!automoder) return;
      if (automoder.AntiUnverifiedBot == false) return;
      const channel = await member.guild.channels.cache.get(
        automoder.LogChannel
      );
      if (!channel) return;
      const embed = new EmbedBuilder()
        .setTitle("Bot Kicked")
        .setDescription(
          `\`TAG-${member.user.tag}, ID-${member.user.id}\` has been kicked from the server because the bot is not verified, hence, it could be malcious`
        )
        .setColor("DarkGreen");
        const message = "If you think that this is a mistake then you can run `/antiunverifiedbotsallow` command to remove this issue"
      if (!member.user.flags.has(UserFlags.VerifiedBot)) {
        channel.send({ content: message, embeds: [embed] });
        member.kick("No Unverified Bots Allowed");
      } else return;
    } else {
      return;
    }
  },
};
