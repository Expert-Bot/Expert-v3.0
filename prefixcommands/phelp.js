const { readdirSync } = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  nombre: 'help',
  description: 'Shows the available prefix commands.',
  usage: ['<prefix>help'],
  run: async (client, message, args) => {
    const prefixCommandFiles = readdirSync('./prefixcommands').filter(file => file.endsWith('.js'));
    const prefixCommands = [];

    prefixCommandFiles.forEach(file => {
      const command = require(`../prefixcommands/${file}`);
      prefixCommands.push(command);
    });

    const itemsPerPage = 5;
    const totalPages = Math.ceil(prefixCommands.length / itemsPerPage);
    const page = parseInt(args[0]) || 1;

    if (page < 1 || page > totalPages) {
      return message.reply('Invalid page number. Please provide a valid page number.');
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentCommands = prefixCommands.slice(start, end);

    const bannerUrl = 'https://share.creavite.co/eyjJaI6bBbOPAGSl.gif'; // Replace with your banner URL

    const embed = {
      color: 0x64e1cb,
      title: 'Prefix Commands Menu',
      description: `Page ${page} of ${totalPages}`,
      fields: [
        { name: 'Important Links', value: '[Vote Here](https://top.gg/bot/1023810715250860105) | [Support Server](https://discord.gg/dj44zMsnNX) | [Patreon](https://www.patreon.com/Drago353/membership)' },
      ],
      image: { url: bannerUrl },
      timestamp: new Date(),
    };

    currentCommands.forEach(command => {
      embed.fields.push({ name: command.nombre, value: `**Description:** ${command.description}\n**Usage:**\n${command.usage}` });
    });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('previous_page')
          .setLabel('Previous Page')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId('next_page')
          .setLabel('Next Page')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages)
      );

    const reply = await message.channel.send({ embeds: [embed], components: [row] });

    const filter = i => i.user.id === message.author.id && ['previous_page', 'next_page'].includes(i.customId);
    const collector = reply.createMessageComponentCollector({ filter, time: 3000000 });

    collector.on('collect', async interaction => {
      if (interaction.customId === 'previous_page') {
        interaction.update({ embeds: [embed], components: [row], ephemeral: true });
        if (page > 1) {
          await interaction.deferUpdate();
          await displayPage(page - 1);
        }
      } else if (interaction.customId === 'next_page') {
        interaction.update({ embeds: [embed], components: [row], ephemeral: true });
        if (page < totalPages) {
          await interaction.deferUpdate();
          await displayPage(page + 1);
        }
      }
    });

    collector.on('end', () => {
      reply.edit({ components: [] });
    });

    async function displayPage(pageNumber) {
      const start = (pageNumber - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const currentCommands = prefixCommands.slice(start, end);

      embed.fields = [];
      embed.description = `Page ${pageNumber} of ${totalPages}`;

      currentCommands.forEach(command => {
        embed.fields.push({ name: command.nombre, value: `**Description:** ${command.description}\n**Usage:**\n${command.usage}` });
      });

      reply.edit({ embeds: [embed] });
    }
  },
};
