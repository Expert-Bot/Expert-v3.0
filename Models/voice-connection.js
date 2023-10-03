const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, entersState, VoiceConnectionStatus, StreamType, createAudioResource } = require('@discordjs/voice');
const { Readable } = require('stream');
const Settings = require('../Models/247');

const connectionMap = new Map();

async function maintainConnection(guildId, voiceChannel, voiceAdapterCreator) {
  const connection = getVoiceConnection(guildId);

  if (!voiceChannel) {
    console.log('No voice channel provided.');
    return;
  }

  if (!connection) {
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    const silence = new Readable();
    silence._read = () => {}; // Define an empty read function

    const resource = createAudioResource(silence, {
      inputType: StreamType.Opus,
    });

    player.play(resource);

    const joined = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceAdapterCreator,
      selfDeaf: true, // Bot should be deafened to prevent echo
    });

    player.on('error', console.error);

    // Store the player in the connection map
    connectionMap.set(guildId, player);

    // Wait for the connection to be ready
    await entersState(joined, VoiceConnectionStatus.Ready, 2000000000); // Adjust the timeout as needed

    console.log(`Joined voice channel ${voiceChannel.name}`);
  }
}

module.exports = { maintainConnection };
