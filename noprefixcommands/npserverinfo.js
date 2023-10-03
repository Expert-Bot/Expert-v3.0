const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  execute(client, message, args) {
    const guild = message.guild;
    const { name, region, memberCount, ownerId, createdAt } = guild;
    const owner = client.users.cache.get(ownerId);
    const { username, discriminator } = owner;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Server Information')
      .addFields(
        { name: 'Server Name', value: name ? name.toString() : 'Unknown' },
        { name: 'Region', value: region ? region.toString() : 'Unknown' },
        { name: 'Member Count', value: memberCount ? memberCount.toString() : 'Unknown' },
        { name: 'Owner', value: `${username}#${discriminator}` || 'Unknown' },
        { name: 'Creation Date', value: createdAt ? createdAt.toDateString() : 'Unknown' }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
