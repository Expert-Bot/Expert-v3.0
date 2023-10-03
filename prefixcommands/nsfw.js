const { MessageEmbed, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { NSFW } = require('nsfw-ts');
const nsfw = new NSFW();
const disabled = require("../Schemas/nsfw");

module.exports = {
  nombre: 'nsfw',
  category: 'NSFW',
  description: 'View NSFW content (18+ only)',
  usage: ['<prefix>nsfw <subcommand>'],
  run: async (client, message, args) => {
    const sub = args[0];

    const DISABLED = await disabled.findOne({ Guild: message.guild.id });

    if (DISABLED) {
      return message.reply({
        content: "❌ Command has been disabled in this server!",
        ephemeral: true
      });
    }

    switch (sub) {
      case '4k':
        if (!message.channel.nsfw) return message.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true });

        const kimage = await nsfw.fourk()
        const kembed = new EmbedBuilder()
        .setAuthor({ name: `🔞 NSFW Playground`})
        .setFooter({ text: `🔞 4K Image Sent`})
        .setTitle('> One 4K Image coming up..')
        .setColor('DarkRed')
        .setImage(kimage)

        await message.channel.send({ embeds: [kembed] });
        break;
      case 'ass':
        if (!message.channel.nsfw) return message.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true });

        const assimage = await nsfw.ass()
        const assembed = new EmbedBuilder()
        .setAuthor({ name: `🔞 NSFW Playground`})
        .setFooter({ text: `🔞 4K Image Sent`})
        .setTitle('> One Ass Image coming up..')
        .setColor('DarkRed')
        .setImage(assimage)

        await message.channel.send({ embeds: [assembed] });
        break;
      case 'pussy':
        if (!message.channel.nsfw) return message.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true });

        const pussyimage = await nsfw.pussy()
            const pussyembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 Ass Image Sent`})
            .setTitle('> One Pussy Image coming up..')
            .setColor('DarkRed')
            .setImage(pussyimage)


        await message.channel.send({ embeds: [pussyembed] });
        break;
      case 'boobs':
        if (!message.channel.nsfw) return message.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true });

        const boobsimage = await nsfw.boobs()
        const boobsembed = new EmbedBuilder()
        .setAuthor({ name: `🔞 NSFW Playground`})
        .setFooter({ text: `🔞 Boobs Image Sent`})
        .setTitle('> One Boobs Image coming up..')
        .setColor('DarkRed')
        .setImage(boobsimage)

        await message.channel.send({ embeds: [boobsembed] });
        break;
      case 'anal':
        if (!message.channel.nsfw) return message.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true });

        const analimage = await nsfw.anal()
        const analembed = new EmbedBuilder()
        .setAuthor({ name: `🔞 NSFW Playground`})
        .setFooter({ text: `🔞 Anal Image Sent`})
        .setTitle('> One Anal Image coming up..')
        .setColor('DarkRed')
        .setImage(analimage)

        await message.channel.send({ embeds: [analembed] });
        break;
      case 'thigh':
        if (!message.channel.nsfw) return message.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true });

        const thighimage = await nsfw.thigh()
        const thighembed = new EmbedBuilder()
        .setAuthor({ name: `🔞 NSFW Playground`})
        .setFooter({ text: `🔞 Thigh Image Sent`})
        .setTitle('> One Thigh Image coming up..')
        .setColor('DarkRed')
        .setImage(thighimage)

        await message.channel.send({ embeds: [thighembed] });
        break;
      case 'pgif':
        if (!message.channel.nsfw) return message.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true });

        const pgifimage = await nsfw.pgif()
        const pgifembed = new EmbedBuilder()
        .setAuthor({ name: `🔞 NSFW Playground`})
        .setFooter({ text: `🔞 Porn GIF Sent`})
        .setTitle('> One Porn GIF coming up..')
        .setColor('DarkRed')
        .setImage(pgifimage)

        await message.channel.send({ embeds: [pgifembed] });
        break;
      case 'hentai':
        if (!message.channel.nsfw) return message.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true });

        const hentaiimage = await nsfw.hentai()
        const hentaiembed = new EmbedBuilder()
        .setAuthor({ name: `🔞 NSFW Playground`})
        .setFooter({ text: `🔞 Hentai Image Sent`})
        .setTitle('> One Hentai Image coming up..')
        .setColor('DarkRed')
        .setImage(hentaiimage)

        await message.channel.send({ embeds: [hentaiembed] });
        break;
      default:
        message.reply('Invalid subcommand. Available subcommands: 4k, ass, pussy, boobs, anal, thigh, pgif, hentai');
        break;
    }
  },
};
