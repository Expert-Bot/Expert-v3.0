const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song.")
    .addStringOption(option =>
      option.setName("query")
        .setDescription("Provide the name or url for the song.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

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
