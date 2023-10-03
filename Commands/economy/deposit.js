const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas/economy');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposites specified amount of money from your wallet into your bank.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('amount').setDescription('Specified amount of currency will be transfered to your bank.').setRequired(true)),
    async execute(interaction) {

        const amount = interaction.options.getString('amount');
        const { options, user, guild } = interaction;
        const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id });

        if (!Data) return await interaction.reply({ content: `You **do not** have an account to do that. \n> Do **/economy** to create an account.`, ephemeral: true});
        if (amount.startsWith('-')) return await interaction.reply({ content: `You **cannot** deposit negative values.`, ephemeral: true})

        if (amount.toLowerCase() === 'all') {
            if(Data.Wallet === 0) return await interaction.reply({ content: `You **can not** deposit any money because your wallet is **empty**.`, ephemeral: true});

            Data.Bank += Data.Wallet;
            Data.Wallet = 0;

            const embed1 = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`Deposit Successful`)
            .setAuthor({ name: `🟡 Economy System`})
            .setDescription(`> ${user.username} has deposited all of \n> their money into their bank`)
            .setFooter({ text: '🟡 Currency Deposited to Bank'})
            .setTimestamp()
            .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')

            await Data.save();

            return await interaction.reply({ embeds: [embed1] })
        } else {
            const Converted = Number(amount);
            
            if(isNaN(Converted) === true) return await interaction.reply({ content: `The number inputed **is not valid**. \n> Inputed value must be a **number** or alternetely **all**.`, ephemeral: true});

            if (Data.Wallet < parseInt(Converted) || Converted === Infinity) return await interaction.reply({ content: `Eligible funds. You **cannot** transfer more than your **wallet**'s balance to your bank.`, ephemeral: true});

            Data.Bank += parseInt(Converted);
            Data.Wallet -= parseInt(Converted);
            Data.Wallet = Math.abs(Data.Wallet);

            await Data.save();

            const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`Deposit Successful`)
            .setAuthor({ name: `🟡 Economy System`})
            .setDescription(`> ${user.username} has deposited \n> $**${parseInt(Converted)}** into their bank`)
            .setFooter({ text: '🟡 Currency Deposited to Bank'})
            .setTimestamp()
            .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')

            return await interaction.reply({ embeds: [embed]})
        }

    }
}