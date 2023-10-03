const { EmbedBuilder } = require("discord.js");
const client = require("../index");

module.exports = {
  nombre: 'play',
  category: 'Music',
  description: 'Play a song.',
  usage: ['<prefix>play <query>'],
  run: async (client, message, args) => {
    const query = args.join(' ');
        const { options, member, guild, channel } = interaction;
    // Check if the message was sent in a guild and if the member exists
    if (!message.guild || !message.member) {
      return message.reply("This command can only be used in a guild and by a guild member.");
    }

    // Check if the member is in a voice channel
    const voiceChannel = message.member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed.setColor("#457cf0").setDescription("You must be in a voice channel to execute music commands.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed.setColor("#457cf0").setDescription(`You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      client.distube.play(voiceChannel, query, { textChannel: channel, member: member });

      interaction.reply({ content: "🎶 Request received. Make sure the Bot has required permissions.", ephemeral: true });

    } catch (err) {
      console.log(err);

      embed.setColor("#457cf0").setDescription("⛔ | Something went wrong...");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};