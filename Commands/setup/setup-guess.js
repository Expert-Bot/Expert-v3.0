const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');

const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, PermissionsBitField, Colors } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;

const Schema = require('../../Schemas/guess');

 

module.exports = {

	data: new SlashCommandBuilder()

		.setName('guess')

		.setDescription('Configure the guess the number settings')

        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)

 

 

        .addSubcommand(subCommand =>

            subCommand.setName('enable')

            .setDescription('Enable guess the number')

            .addChannelOption(option =>

                option.setName('channel')

                .setDescription('The channel you want as guess the number channel')

                .setRequired(true)))

 

        .addSubcommand(subCommand =>

            subCommand.setName('disable')

            .setDescription('Disable guess the number')),

	async execute(interaction) {

 

		const { options, client, guild } = interaction;

 

        if(options.getSubcommand() === 'disable') {

 

            const data = await Schema.findOne({guildId: guild.id});

 

            const noData = new EmbedBuilder()

            .setDescription(`❌ | You do not have guess the number setup!`)

            .setFooter({text: `Made by drago`})

            .setTimestamp()

            .setColor(Colors.Red);

 

            if(!data) return interaction.reply({embeds: [noData]})

 

            if(data) {

 

                await data.delete();

                return interaction.reply({content: `✅`})

            }

        };

 

 

 

        if(options.getSubcommand() === 'enable') {

 

        const data = await Schema.findOne({guildId: guild.id});

 

        const alreadySetup = new EmbedBuilder()

        .setDescription(`❌ | Your guess the number system is already setup!`)

        .setFooter({text: `Made by https://ticketer-bot.xyz/`})

        .setTimestamp()

        .setColor(Colors.Red);

 

        if(data) return interaction.reply({embeds: [alreadySetup]});

 

        if(!data) {

 

            const RandomNumber = Math.floor(Math.random() * 1000000);

 

            const channel = options.getChannel('channel');

            const channelID = channel.id;

 

            const newSchema = await Schema.create({

                guildId: guild.id,

                channelId: channelID,

                number: RandomNumber

            });

 

            await newSchema.save().catch((err) => console.log(err));

 

            const successEmbed = new EmbedBuilder()

            .setDescription(`✅ | You've successfully setup the guess the number system. \n\nThe number is: ${RandomNumber} \nThe channel is: <#${channelID}>`)

            .setFooter({text: `Made by https://ticketer-bot.xyz/`})

            .setTimestamp()

            .setColor(Colors.Green);

 

            interaction.reply({embeds: [successEmbed]})

        }

 

        }

		  }

	}