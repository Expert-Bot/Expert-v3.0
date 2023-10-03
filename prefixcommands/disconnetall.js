const {PermissionsBitField} = require ('discord.js');
module.exports = {
  nombre: 'disconnect-all',
  category: 'Moderation',
  description: 'Disconnect all members of the specified voice channel',
  usage: ['<prefix>disconnect-all <voice_channel_name>'],
  run: async (client, message, args) => {
    // Check if the user has permission to use the commandss
    if (!message.member.permissions.has(PermissionsBitField.Flags.MOVE_MEMBERS)) {
      return message.reply("You do not have permission to use this command.");
    }

    // Find the specified voice channel by name
    const voiceChannelName = args.join(' ');
    const voiceChannel = message.guild.channels.cache.find(channel => {
      return (
        channel.type === 'voice' &&
        channel.name.toLowerCase() === voiceChannelName.toLowerCase()
      );
    });

    // Check if the voice channel was found
    if (!voiceChannel) {
      return message.reply("Voice channel not found.");
    }

    // Retrieves all members in the specified voice channel
    const members = voiceChannel.members;

    // Disconnects each member from the voice channel
    members.forEach(member => {
      if (member.voice.channel) {
        member.voice.setChannel(null); // Disconnect member from voice channel
      }
    });

    // Send a message indicating that the operation is finished
    return message.reply("Finished.");
  },
};

