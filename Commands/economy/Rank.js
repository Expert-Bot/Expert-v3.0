const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const levelSchema = require ("../../Schemas/level");
const Canvacord = require('canvacord');
const levelschema = require('../../Schemas/levelsetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDMPermission(false)
        .addUserOption(option => option.setName('user').setDescription(`Specified user's rank will be displayed.`).setRequired(false))
        .setDescription(`Displays specified user's current rank (level).`),
    async execute(interaction) {

        const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });
        if (!levelsetup || levelsetup.Disabled === 'disabled')
            return await interaction.reply({ content: `The **Administrators** of this server **have not** set up the **leveling system** yet! use **/Leveling Enabled** to Enable it`, ephemeral: true});

        const { options, user, guild } = interaction;

        const Member = options.getMember('user') || user;

        const member = guild.members.cache.get(Member.id);

        const Data = await levelSchema.findOne({ Guild: guild.id, User: member.id});

        const embednoxp = new EmbedBuilder()
            .setColor(0xa80f4)
            .setThumbnail('https://media.discordapp.net/attachments/1101154375415631984/1109479143218888744/image-removebg-preview.png?width=595&height=500')
            .setTimestamp()
            .setTitle(`> ${Member.username}'s Rank`)
            .setFooter({ text: `⬆ ${Member.username}'s Ranking`})
            .setAuthor({ name: `⬆ Level Playground`})
            .addFields({ name: `• Level Details`, value: `> Specified member has not gained any XP`});

        if (!Data)
            return await interaction.reply({ embeds: [embednoxp] });

        await interaction.deferReply();

        const Required = Data.Level * Data.Level * 20 + 20;

        const rank = new Canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ format: 'png', dynamic: false }))
            .setBackground('IMAGE', 'https://media.discordapp.net/attachments/1101154375415631984/1114976407446114425/Blue_Modern_Technology_Linktree_Background_1.png?width=985&height=656')
            .setCurrentXP(Data.XP)
            .setRequiredXP(Required)
            .setRank(1)
            .setLevel(Data.Level)
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator);

        const card = await rank.build();

        const attachment = new AttachmentBuilder(card, 'rank.png');

        await interaction.editReply({ files: [attachment] });
    }
};
