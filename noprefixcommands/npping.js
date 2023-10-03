const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Ping command to check bot latency.',
  execute(client, message, args) {
    // Send a message indicating that the bot is processing the command
    message.channel.send('Pinging...').then(sentMessage => {
      // Calculate the latency by subtracting the current timestamp from the original message's timestamp
      const ping = sentMessage.createdTimestamp - message.createdTimestamp;

      // Create a new MessageEmbed
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ping')
        .addFields(
            {name: 'Latency', value: `${ping}ms`},
            {name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`}
        );
      // Edit the original message with the embed
      sentMessage.edit({ content: '\u200B', embeds: [embed] });
    });
  },
};
