const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Display loop options.")
        .addStringOption(option =>
            option.setName("options")
                .setDescription("Loop options: off, song, queue")
                .addChoices(
                    { name: "off", value: "off" },
                    { name: "song", value: "song" },
                    { name: "queue", value: "queue" },
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const { member, options, guild } = interaction;
        const option = options.getString("options");
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

            let mode = null;

            switch (option) {
                case "off":
                    mode = 0;
                    break;
                case "song":
                    mode = 1;
                    break;
                case "queue":
                    mode = 2;
                    break;
            }

            mode = await queue.setRepeatMode(mode);

            mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";

            embed.setColor("Orange").setDescription(`🔁 Set repeat mode to \`${mode}\`.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Something went wrong...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

    }
}