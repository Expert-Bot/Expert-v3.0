const { EmbedBuilder } = require('discord.js');

module.exports = {
  nombre: 'ping',
  category: 'General',
  description: 'Check the bot\'s ping to the server.',
  usage: ['<prefix>ping'],
  run: async (client, message, args) => {
    const responseTime = Date.now() - message.createdTimestamp;

    const pingEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Ping Pong!')
      .setDescription(`Bot's ping is ${responseTime}ms.`);

    message.reply({ embeds: [pingEmbed] });
  },
};
