//define everything I will need
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
 
module.exports = {
    //create the slash command
    data: new SlashCommandBuilder()
    .setName('takerole')
    .setDescription('Takes a role from a user')
    .addUserOption(o => o.setName('user').setDescription('The user, who you want to take a role from').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('The role you want to give the user').setRequired(true)),
    async execute (interaction) {
        //get the variables
        const targetTag = interaction.options.getUser('user').tag;
        const target = interaction.options.getMember('user');
        const targetRole = interaction.options.getRole('role');
        
        //permission check, give an error if the member does not have the "Manage Roles" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply('You do not have permission to do this.');
        //define the buttons
        
        
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success);
        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);        
        const confirmed = new ButtonBuilder()
            .setCustomId('confirmed')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);
        const canceled = new ButtonBuilder()
            .setCustomId('canceled')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
        const rowEnabled = new ActionRowBuilder()
        .addComponents(confirm, cancel)
        const rowDisabled = new ActionRowBuilder()
        .addComponents(confirmed, canceled)
        //define all of the embeds
        const embed = new EmbedBuilder()
        .setTitle('Role Take Confirmation')
        .setColor("#000000")
        .setDescription(`Would you like to take the ${targetRole} role from ${targetTag}?`)
        .setFooter({ text: "Are you sure?" })
        const embedConfirm = new EmbedBuilder()
        .setTitle('Role Take Confirmed')
        .setColor("#00FF00")
        .setDescription(`The ${targetRole} role was removed from ${targetTag}!`)
        .setFooter({ text: "Confirmed!" })
        const embedCancel = new EmbedBuilder()
        .setTitle('Role Take Cancelled')
        .setColor("#FF0000")
        .setDescription(`Did not take the ${targetRole} role from ${targetTag}.`)
        .setFooter({ text: "Canceled." })
        const embedErr = new EmbedBuilder()
        .setTitle('Error')
        .setColor("#FF0000")
        .setDescription('Something went wrong and I was unable to do the requested action.')
        //send the message
        const message = await interaction.reply({ embeds: [embed], components: [rowEnabled] })
        const collector = await message.createMessageComponentCollector()
        
        //execute some stuff when buttons are pressed
        collector.on('collect', async i => {
            if (i.customId == "confirm") {
                if (i.user.id !== interaction.user.id) return i.reply({ content: `This is ${interaction.user.tag}'s confirmation modal, not yours.'`})
                target.roles.remove(targetRole).catch(err => {
                    console.error(err)
                    return i.update({ embeds: [embedErr], ephemeral: false, components: [rowDisabled] })
                })
                return i.update({ embeds: [embedConfirm], components: [rowDisabled] })
            }
            if (i.customId == "cancel") {
                if (i.user.id !== interaction.user.id) return await i.reply({ content: `This is ${interaction.user.tag}'s confirmation modal, not yours.'`})
                return i.update({ embeds: [embedCancel], components: [rowDisabled] })
            }
        })
}}