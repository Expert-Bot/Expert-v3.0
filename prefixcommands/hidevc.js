
const { PermissionsBitField } = require('discord.js')
module.exports = {
    nombre: 'hide',
    category: 'Moderation',
    description: 'Hide a text channel.',
    usage: ['<prefix>hide <text_channel_name>'],
    run: async (client, message, args) => {
      // Check if the user has permission to use the command
      if (!message.member.hasPermission(PermissionsBitField.Flags.MANAGE_CHANNELS)) {
        return message.reply("You don't have permission to hide channels.");
      }
  
      // Find the specified text channel by name
      const textChannelName = args.join(' ');
      const textChannel = message.guild.channels.cache.find(channel => {
        return (
          channel.type === 'GUILD_TEXT' &&
          channel.name.toLowerCase() === textChannelName.toLowerCase()
        );
      });
  
      // Check if the text channel was found
      if (!textChannel) {
        return message.reply("Text channel not found.");
      }
  
      // Hide the text channel by setting permissions
      textChannel.permissionOverwrites.edit(message.guild.roles.everyone, {
        VIEW_CHANNEL: false,
      });
  
      // Send a message indicating that the channel has been hidden
      return message.reply(`The channel ${textChannelName} has been hidden successfully.`);
    },
  };
  