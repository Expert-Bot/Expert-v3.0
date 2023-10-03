
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const bans = require('../Schemas/ban.js');
const ms = require('ms');

module.exports = {
  nombre: 'ban',
  category: 'Moderation',
  description: 'Ban a specified user.',
  usage: ['<prefix>ban <user> [time] [reason]'],
  run: async (client, message, args) => {
    const userArg = args[0];
    const timeArg = args[1];
    const reasonArg = args.slice(2).join(' ');

    // Check if the user has the required permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.BAN_MEMBERS)) {
      return message.reply('You do not have permission to ban members.');
    }

    // Check if the command has the minimum required arguments
    if (!userArg) {
      return message.reply('Please specify the user you want to ban.');
    }

    // Find the mentioned user
    const user = message.mentions.members.first() || message.guild.members.cache.get(userArg);

    if (!user) {
      return message.reply('User not found.');
    }

    // Check if the user can be banned
    if (!user.bannable) {
      return message.reply('I cannot ban this user. Check my role position and try again.');
    }

    // Check if a time is specified
    if (timeArg) {
      // Calculate the ban duration in milliseconds using 'ms' library
      const banDuration = ms(timeArg);

      if (!banDuration) {
        return message.reply('Invalid time format for ban duration.');
      }

      // Ban the user with a temporary ban
      await user.ban({ reason: reasonArg });

      // Save the ban information in your database if needed
      const settime = Date.now() + banDuration;
      await bans.create({
        Guild: message.guild.id,
        User: user.id,
        Time: settime
      });

      message.reply(`User ${user.user.tag} has been temporarily banned for ${ms(banDuration, { long: true })}. Reason: ${reasonArg || 'No reason provided.'}`);
    } else {
      // Permanent ban
      await user.ban({ reason: reasonArg });
      message.reply(`User ${user.user.tag} has been permanently banned. Reason: ${reasonArg || 'No reason provided.'}`);
    }
  },
};
