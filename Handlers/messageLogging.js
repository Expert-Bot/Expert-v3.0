const { EmbedBuilder } = require('discord.js');
const messageLogSchema = require('../Schemas/messageLogSchema'); // Change the path accordingly

module.exports = async (client) => {
  client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;

    const logData = await messageLogSchema.findOne({ Guild: newMessage.guild.id });
    if (!logData) return;

    const logChannel = newMessage.guild.channels.cache.get(logData.Channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('DarkBlue')
      .setTitle('Message Edited')
      .setDescription(`**User:** ${newMessage.author} (${newMessage.author.id})\n**Channel:** ${newMessage.channel}\n\n**Old Message:** ${oldMessage.content}\n**New Message:** ${newMessage.content}`)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  });

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const logData = await messageLogSchema.findOne({ Guild: message.guild.id });
    if (!logData) return;

    const logChannel = message.guild.channels.cache.get(logData.Channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('DarkBlue')
      .setTitle('New Message')
      .setDescription(`**User:** ${message.author} (${message.author.id})\n**Channel:** ${message.channel}\n\n**Message:** ${message.content}`)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  });

  client.on('messageDelete', async (message) => {
    if (message.author.bot) return;

    const logData = await messageLogSchema.findOne({ Guild: message.guild.id });
    if (!logData) return;

    const logChannel = message.guild.channels.cache.get(logData.Channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('DarkBlue')
      .setTitle('Message Deleted')
      .setDescription(`**User:** ${message.author} (${message.author.id})\n**Channel:** ${message.channel}\n\n**Message:** ${message.content}`)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  });
};
