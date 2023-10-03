const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require ("../../Schemas/level");
const ecoSchema = require ("../../Schemas/economy");
const levelschema = require('../../Schemas/levelsetup');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription(`Reset something in this server.`)
    .setDMPermission(false)
    .addSubcommand(command => command.setName('all-xp').setDescription('Resets all XP progress in this server.'))
    .addSubcommand(command => command.setName('all-currency').setDescription('Resets all economy progress in this server.'))
    .addSubcommand(command => command.setName('currency').setDescription(`Resets specified user's economy currency.`).addUserOption(option => option.setName('user').setDescription(`Specified user's economy account will be reset.`).setRequired(true)))
    .addSubcommand(command => command.setName('xp').setDescription(`Resets specified user's economy currency.`).addUserOption(option => option.setName('user').setDescription('Specified user will have their xp reset.').setRequired(true))),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        const sub = interaction.options.getSubcommand();
        
        switch (sub) {

            case 'all-xp':

            const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });
            if (!levelsetup || levelsetup.Disabled === 'disabled') return await interaction.reply({ content: `The **Administrators** of this server **have not** set up the **leveling system** yet!`, ephemeral: true});

            levelSchema.deleteMany({ Guild: interaction.guild.id}, async (err, data) => {

                const embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle(`${interaction.guild.name}'s XP was reset`)
                .setAuthor({ name: `⬆ Level Playground  `})
                .setDescription(`> ${interaction.guild.name}'s XP has been set to **0**`)
                .setFooter({ text: '⬆ Level Reset Acknowledged'})
                .setTimestamp()
                .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')
    
                await interaction.reply({ embeds: [embed] })
    
            })

            break;
            case 'xp':

            const levelsetup1 = await levelschema.findOne({ Guild: interaction.guild.id });
            if (!levelsetup1 || levelsetup1.Disabled === 'disabled') return await interaction.reply({ content: `The **Administrators** of this server **have not** set up the **leveling system** yet!`, ephemeral: true});

            const target = interaction.options.getUser('user');

            levelSchema.deleteMany({ Guild: interaction.guild.id, User: target.id}, async (err, data) => {

                const embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle(`${target.username}'s XP was reset`)
                .setAuthor({ name: `⬆ Level Playground  `})
                .setDescription(`> ${target.username}'s XP has been set to **0**`)
                .setFooter({ text: '⬆ Level Reset Acknowledged'})
                .setTimestamp()
                .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')

                await interaction.reply({ embeds: [embed] })

            })

            break;
            case 'currency':

            const user = interaction.options.getUser('user');

            ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id}, async (err, data) => {

                const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle(`${user.username}'s Currency was reset`)
                .setAuthor({ name: `🟡 Economy System`})
                .setDescription(`> ${user.username}'s money has been set to $**0**`)
                .setFooter({ text: '🟡 Currency Reset Acknowledged'})
                .setTimestamp()
                .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')

                if (err) throw err;
    
                if (!data) return await interaction.reply({ content: `${user} needs to have **created** a past account in order to add to their currency.`, ephemeral: true})

                const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id});

                if (Data.Wallet + Data.Bank === 0) {
                    return await interaction.reply({ content: `${user} has **no money**, you **do not** need to reset their money.`, ephemeral: true})
                } else {
                
                    Data.Wallet = 0;
                    Data.Bank = 0;
                    Data.save();

                    interaction.reply({ embeds: [embed]})
            
                }
            })

            break;
            case 'all-currency':

            ecoSchema.deleteMany({ Guild: interaction.guild.id}, async (err, data) => {

                const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle(`${interaction.guild.name}'s economy system was reset`)
                .setAuthor({ name: `🟡 Economy System`})
                .setDescription(`> ${interaction.guild.name}'s economy has been set back \n> to **Default**`)
                .setFooter({ text: '🟡 Economy Global Reset Acknowledged'})
                .setTimestamp()
                .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')
    
                await interaction.reply({ embeds: [embed] })
    
            })
        }
    }
}