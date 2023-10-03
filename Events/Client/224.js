const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  handleVoiceChannel(guildId, channelId, adapterCreator) {
    const connection = getVoiceConnection(guildId);

    if (!connection) {
      try {
        joinVoiceChannel({
          channelId: channelId,
          guildId: guildId,
          adapterCreator: adapterCreator,
        });
        console.log('Joined voice channel:', channelId);
      } catch (error) {
        console.error('Error joining voice channel:', error);
      }
    } else {
      console.log('Already in a voice channel:', connection.joinConfig.channelId);
    }
  },

  handleVoiceChannelLeave(guildId) {
    const connection = getVoiceConnection(guildId);

    if (connection) {
      try {
        connection.destroy();
        console.log('Left voice channel');
      } catch (error) {
        console.error('Error destroying voice connection:', error);
      }
    } else {
      console.log('Not in a voice channel');
    }
  },
};
