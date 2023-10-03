const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ecoSchema = require('../../Schemas/economy');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('economy')
    .setDMPermission(false)
    .setDescription('Creates your economy account.'),
    async execute(interaction) {

        const  {user, guild} = interaction;

        let Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id});

        const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setThumbnail('https://media.discordapp.net/attachments/1082294727854006353/1107413820042915882/image.png?width=595&height=500')
        .setAuthor({ name: `🟡 Economy System`})
        .setFooter({ text: `🟡 Economy Account Page`})
        .setTimestamp()
        .setTitle('> Economy Account Setup')
        .addFields({ name: `• Options`, value: `> Choose an option`, inline: false})
        .addFields({ name: `• Delete`, value: `> Deletes your economy account. Use with caution.`, inline: true})
        .addFields({ name: `• Create`, value: `> Creates your economy account.`, inline: true})

        const embed2 = new EmbedBuilder()
        .setColor("Yellow")
        .setThumbnail('https://media.discordapp.net/attachments/1082294727854006353/1107413820042915882/image.png?width=595&height=500')
        .setAuthor({ name: `🟡 Economy System`})
        .setFooter({ text: `🟡 Economy Account Created`})
        .setTimestamp()
        .setTitle('> Economy Account was Setup')
        .addFields({ name: `• Account Created`, value: `> ${interaction.user.username}, your account is now open. \n> Here is $**1000**, hope this helps!`})

        const embed3 = new EmbedBuilder()
        .setColor("Yellow")
        .setThumbnail('https://media.discordapp.net/attachments/1082294727854006353/1107413820042915882/image.png?width=595&height=500')
        .setAuthor({ name: `🟡 Economy System`})
        .setFooter({ text: `🟡 Economy Account Deleted`})
        .setTimestamp()
        .setTitle('> Economy Account was Terminated')
        .addFields({ name: `• Account Created`, value: `> ${interaction.user.username}, your account was deleted`})

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('page1')
            .setLabel('✔ Create')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('page2')
            .setLabel('❌ Delete')
            .setStyle(ButtonStyle.Danger),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });

        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {

            if (i.customId === 'page1') {
                
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: `You **cannot** use ${interaction.user.tag} menu!`, ephemeral: true})
                }

                if (!Data) {

                    Data = new ecoSchema({
                        Guild: interaction.guild.id,
                        User: user.id,
                        Bank: 0,
                        Wallet: 1000
                    })

                    await Data.save();

                    await i.update({ embeds: [embed2], components: [] });
                } else {
                    return i.reply({ content: `You **already** have an account, you cannot create another one.`, ephemeral: true})
                }
            }

            if (i.customId === 'page2') {

                if (!Data) {
                    return i.reply({ content: `You **do not** have an account yet, can't delete nothing.`, ephemeral: true})
                } else {

                    if (i.user.id !== interaction.user.id) {
                        return i.reply({ content: `You **cannot** use ${interaction.user.tag} menu!`, ephemeral: true})
                    }

                    await ecoSchema.deleteMany({ Guild: interaction.guild.id, User: interaction.user.id }); 

                    await i.update({ embeds: [embed3], components: [] });
                }
            }
        })
    }
}