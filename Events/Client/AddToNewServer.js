const { Events, Guilds, Client, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  name: 'guildCreate',
  once: false,
  async execute(guild) {
    const channel = guild.channels.cache.random();
    if (!channel) return;

    const but = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Support")
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/GEEkNWvsP3'),

        new ButtonBuilder()
          .setLabel("Vote")
          .setStyle(ButtonStyle.Link)
          .setURL('https://top.gg/bot/1023810715250860105')

      )

    const emb = new EmbedBuilder()
      .addFields({ name: 'Guidelines', value: '> • I am only running on **slash commands**. \n> • Find my all commands by using </help:1080512943021633594> command. \n> • Use </report-bug:1234> if you found any **bug**. \n\n🎟️ **If you need any help feel free to join our support server**. \n⚠️ **Make sure to give my required permissions.**', inline: false })
      .setDescription('**Advanced futuristic discord bot with many amazing high functional features like MiniGames, Giveaways, Counting system and many more.**')
      .setAuthor({ name: '❤️ Thanks for adding me!' })
      .setTitle('Hi, I am XEpert.')
      .setFooter({ text: '©XEpert - 2023' })
      .setTimestamp()
      .setColor('Blue')

    channel.send({ embeds: [emb], components: [but] });
  }
};