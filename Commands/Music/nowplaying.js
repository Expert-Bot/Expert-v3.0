const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Display info about the currently playing song."),
    async execute(interaction) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("You must be in a voice channel to execute music commands.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {

            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed.setColor("Red").setDescription("There is no active queue.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const song = queue.songs[0];
            embed.setColor("Blue").setDescription(`🎶 **Currently playing:** \`${song.name}\` - \`${song.formattedDuration}\`.\n**Link:** ${song.url}`).setThumbnail(song.thumbnail);
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Something went wrong...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}