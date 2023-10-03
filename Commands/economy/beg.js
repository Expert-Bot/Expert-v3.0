const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const ecoSchema = require('../../Schemas/economy');
var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for some money.')
    .setDMPermission(false),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && timeout.includes(interaction.member.id)) return await interaction.reply({ content: 'You are on cooldown! You **cannot** execute /beg.', ephemeral: true})

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 10000)

        const  {user, guild} = interaction;

        let Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id});

        if (!Data) return await interaction.reply({ content: `You **have not** opened an account yet, you cannot earn any money without an account :( \n> Do **/economy** to open your account.`, ephemeral: true});

        let negative = Math.round((Math.random() * -300) - 10)
        let positive = Math.round((Math.random() * +300) + 10)

        const posN = [negative, positive];

        const amount = Math.round((Math.random() * posN.length));
        const value = posN[amount];

        if (!value) return await interaction.reply({ content: `You were **rejected**. No money this time :(`, ephemeral: true});

        if (Data) {
            Data.Wallet += value;
            await Data.save();
        }

        if (value > 0) {

            const embed1 = new EmbedBuilder()
            .setColor("Yellow")
            .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')
            .setTimestamp()
            .setFooter({ text: `🟡 Begging Attempt`})
            .setAuthor({ name: `🟡 Economy System`})
            .setTitle('> Begging Succeeded')
            .addFields({ name: `• Result`, value: `> The unknown gave you **$${value}**`})

            await interaction.reply({ embeds: [embed1] });
        } else {

            const stringv = `${value}`;

            const nonSymbol = await stringv.slice(1);

            const embed2 = new EmbedBuilder()
            .setColor("Yellow")
            .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')
            .setTimestamp()
            .setFooter({ text: `🟡 Begging Attempt`})
            .setAuthor({ name: `🟡 Economy System`})
            .setTitle('> Begging was a Mistake')
            .addFields({ name: `• Result`, value: `> Begging is not always the option \n> deer, you lost **$${nonSymbol}**`})

            await interaction.reply({ embeds: [embed2]})
        }
    }
}