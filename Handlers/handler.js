const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const Settings = require('../Models/247');

module.exports = {
  async handle(guildId, member, is247Enabled) {
    const settings = await Settings.findOne({ guildId });

    if (is247Enabled && member.voice.channel && !getVoiceConnection(guildId)) {
      const player = joinVoiceChannel({
        channelId: member.voice.channelId,
        guildId,
        adapterCreator: member.guild.voiceAdapterCreator,
      });

      player.on('error', console.error);
    } else if (!is247Enabled && getVoiceConnection(guildId)) {
      getVoiceConnection(guildId).destroy();
    }
    
    if (settings) {
      settings.is247Enabled = is247Enabled;
      await settings.save();
    }
  }
};
