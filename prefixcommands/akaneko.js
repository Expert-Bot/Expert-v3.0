const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const akaneko = require("akaneko");

module.exports = {
  nombre: 'akaneko',
  category: 'NSFW',
  description: 'View NSFW content (18+ only)',
  usage: ['<prefix>akaneko <type>'],
  run: async (client, message, args) => {
    // Check if the command is used in a DM or NSFW channel
    if (!message.guild || !message.channel.nsfw) {
      return message.reply('This command can only be used in an NSFW channel in a server.');
    }

    // Check if the user provided a type
    const type = args[0];
    if (!type) {
      return message.reply('Please specify a type (ass, bdsm, gifs, glasses, hentai, maid, masturbation, pussy, school, thighs, uniform).');
    }

    // Create a row of buttons with "Yes" and "No" options
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId("confirm-yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId("confirm-no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger),
      );

    await message.reply({
      content: 'Are you older than 18+ and want to view this NSFW content?',
      components: [row],
    });

    // Create a filter to collect the user's button click
    const filter = (interaction) => interaction.customId === 'confirm-yes' || interaction.customId === 'confirm-no';

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 15000, // Adjust the time as needed
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'confirm-yes') {
        // User confirmed, show NSFW content
        const embed = new EmbedBuilder().setTimestamp().setTitle(`Category: ${type}`);
        
        switch (type) {
          case 'ass':
            embed.setImage(await akaneko.nsfw.ass());
            break;
          case 'bdsm':
            embed.setImage(await akaneko.nsfw.bdsm());
            break;
          case 'gifs':
            embed.setImage(await akaneko.nsfw.gifs());
            break;
          case 'glasses':
            embed.setImage(await akaneko.nsfw.glasses());
            break;
          case 'hentai':
            embed.setImage(await akaneko.nsfw.hentai());
            break;
          case 'maid':
            embed.setImage(await akaneko.nsfw.maid());
            break;
          case 'masturbation':
            embed.setImage(await akaneko.nsfw.masturbation());
            break;
          case 'pussy':
            embed.setImage(await akaneko.nsfw.pussy());
            break;
          case 'school':
            embed.setImage(await akaneko.nsfw.school());
            break;
          case 'thighs':
            embed.setImage(await akaneko.nsfw.thighs());
            break;
          case 'uniform':
            embed.setImage(await akaneko.nsfw.uniform());
            break;
          default:
            return message.reply('Invalid type specified.');
        }

        await message.channel.send({ embeds: [embed] });
      } else {
        // User declined, provide a message or take appropriate action
        await message.reply('You declined to view NSFW content.');
      }

      // Stop collecting after the user's choice
      collector.stop();
    });

    collector.on('end', (collected) => {
      // Remove the buttons when the collector ends
      if (collected.size > 0) {
        message.channel.send({ content: 'NSFW content confirmation buttons have been removed.', components: [] });
      }
    });
  },
};
