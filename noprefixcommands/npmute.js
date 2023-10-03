const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'mute',
  description: 'Mute a member from the guild.',
  async execute(client, message, args) {
    // Check if the user has the necessary permissions to use the command
    if (!message.member.permissions.has(PermissionFlagsBits.MANAGE_ROLES)) {
      return message.reply("You don't have permission to use this command.");
    }

    // Check if a user was mentioned
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('Please mention a user to mute.');
    }

    // Get the member object from the mentioned user
    const member = message.guild.members.cache.get(user.id);

    // Check if the mentioned user is a member of the guild
    if (!member) {
      return message.reply('The mentioned user is not a member of this guild.');
    }

    // Check if the bot has the necessary permissions to manage roles
    if (!message.guild.me.permissions.has(PermissionFlagsBits.MANAGE_ROLES)) {
      return message.reply("I don't have permission to manage roles.");
    }

    // Get the mute duration and reason from the command arguments
    const duration = args[1];
    const reason = args.slice(2).join(' ') || 'No reason provided';

    // Calculate the mute duration in milliseconds using the ms library
    const muteDuration = ms(duration);

    // Check if the mute duration is valid
    if (!muteDuration) {
      return message.reply('Invalid mute duration. Please provide a valid duration (e.g., 1h, 30m).');
    }

    // Find the "Muted" role in the guild
    const mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');

    // Check if the "Muted" role exists
    if (!mutedRole) {
      return message.reply('The "Muted" role does not exist. Please create the role first.');
    }

    // Mute the member by adding the "Muted" role
    member.roles
      .add(mutedRole)
      .then(async () => {
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('User Muted')
          .setDescription(`${user} has been muted for ${duration}.`)
          .addField('Reason', reason)
          .setTimestamp()
          .setFooter(`Muted by ${message.author.tag}`);

        await message.channel.send({ embeds: [embed] });

        // Remove the muted role after the mute duration expires
        setTimeout(async () => {
          await member.roles.remove(mutedRole);
          message.channel.send(`${user} has been unmuted.`);
        }, muteDuration);
      })
      .catch(error => {
        console.error(error);
        message.reply('Failed to mute the user.');
      });
  },
};
