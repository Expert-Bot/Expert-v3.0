
// credit : prtzzz?.
const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed-builder")
        .setDescription("Send a custom embed")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        let Modal = new ModalBuilder()
            .setCustomId('report')
            .setTitle('Create your embed')

        let question1 = new TextInputBuilder()
            .setCustomId('title')
            .setLabel('What title do you want to put?')
            .setRequired(false)
            .setPlaceholder('Written here... (optional)')
            .setStyle(TextInputStyle.Short)

        let question2 = new TextInputBuilder()
            .setCustomId('description')
            .setLabel("What description do you want to put?")
            .setRequired(true)
            .setPlaceholder('Written here...')
            .setStyle(TextInputStyle.Paragraph)

        let question3 = new TextInputBuilder()
            .setCustomId('colour')
            .setLabel('What color do you want to put?')
            .setRequired(false)
            .setPlaceholder('In this format: #3dffcc (optional)')
            .setStyle(TextInputStyle.Short)

        let question4 = new TextInputBuilder()
            .setCustomId('footer')
            .setLabel('Which footer do you want to put ?')
            .setRequired(false)
            .setPlaceholder('Written here... (optional)')
            .setStyle(TextInputStyle.Short)

        let question5 = new TextInputBuilder()
            .setCustomId('timestamp')
            .setLabel('Do you want to put the timestamp?')
            .setRequired(false)
            .setPlaceholder('Yes/No (optional)')
            .setStyle(TextInputStyle.Short)

        let ActionRow1 = new ActionRowBuilder().addComponents(question1);
        let ActionRow2 = new ActionRowBuilder().addComponents(question2);
        let ActionRow3 = new ActionRowBuilder().addComponents(question3);
        let ActionRow4 = new ActionRowBuilder().addComponents(question4);
        let ActionRow5 = new ActionRowBuilder().addComponents(question5);

        Modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4, ActionRow5)

        await interaction.showModal(Modal)

        try {

            let reponse = await interaction.awaitModalSubmit({ time: 300000 })

            let titre = reponse.fields.getTextInputValue('title')
            let description = reponse.fields.getTextInputValue('description')
            let couleur = reponse.fields.getTextInputValue('colour')
            let footer = reponse.fields.getTextInputValue('footer')
            let timestamp = reponse.fields.getTextInputValue('timestamp')

            const Embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`<:SW_Icons_rverified:1106291121690251325> **Your embed has been successfully sent!**`)

            if (!couleur) couleur = "Blue"
            if (!footer) footer = ' '
            if (!titre) titre = ' '
            if (!description) description = ' '

            let Embed1 = new EmbedBuilder()
                .setColor(`${couleur}`)
                .setTitle(`${titre}`)
                .setDescription(`${description}`)
                .setFooter({ text: `${footer}` })

            if (reponse.fields.getTextInputValue('timestamp') === 'Yes') Embed1.setTimestamp()
            if (!reponse.fields.getTextInputValue('timestamp') === 'Yes') return;

            await interaction.channel.send({ embeds: [Embed1] })

            await reponse.reply({ embeds: [Embed], ephemeral: true })


        } catch (err) { return; }
    }
}