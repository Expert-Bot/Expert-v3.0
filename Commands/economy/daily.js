const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoS = require('../../Schemas/economy');
 
var timeout = [];
 
module.exports = {
    data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('daily')
    .setDescription('Allows you to claim a random amount of currency each day.'),
 
    async execute(interaction) {
        const { options, guild, user } = interaction;
        
        let data = await ecoS.findOne({ Guild: guild.id, User: user.id });
 
        if (timeout.includes(interaction.user.id) && interaction.user.id !== '903237169722834954') return await interaction.reply({ content: "You have **already** claimed your daily amount! Please check back **later**.", ephemeral: true });
 
        if (!data) return await interaction.reply({ content: "You **do not** have an account yet! \n> Do **/economy** to configure your account.", ephemeral: true });
        else {
            const randAmount = Math.round((Math.random() * 3000) + 10);
 
            data.Wallet += randAmount;
            data.save();
 
            const embed = new EmbedBuilder()
                .setAuthor({ name: `🟡 Economy System`})
                .setFooter({ text: `🟡 Daily Claimed`})
                .setColor('Yellow')
                .setTitle('> Daily Allowance Claimed')
                .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')
                .setDescription(`• Amount: **$${randAmount}**\n• Next claim available: **12 hours**`)
                .setTimestamp();
 
            await interaction.reply({ embeds: [embed] });
 
            timeout.push(interaction.user.id);
            setTimeout(() => {
                timeout.shift();
            }, 43200000);
        }
    }
}