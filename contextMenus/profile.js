
const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const model = require('../Schemas/badges');
const Schema = require('../Schemas/profile');
const CreditsSchema = require("../Schemas/votecredits");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Dbot profile')
        .setType(2),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        const badgeFlags = {
            DEVELOPER: client.emotes.badges.developer,
            EVENT: client.emotes.badges.event,
            BOOSTER: client.emotes.badges.booster,
            BUGS: client.emotes.badges.bug,
            MANAGEMENT: client.emotes.badges.management,
            PREMIUM: client.emotes.badges.premium,
            SUPPORTER: client.emotes.badges.supporter,
            TEAM: client.emotes.badges.team,
            BOOSTER: client.emotes.badges.booster,
            PARTNER: client.emotes.badges.partner,
            VOTER: client.emotes.badges.voter,
            SUPPORT: client.emotes.badges.support,
            MODERATOR: client.emotes.badges.moderator,
            DESIGNER: client.emotes.badges.designer,
            MARKETING: client.emotes.badges.marketing,
            ACTIVE: client.emotes.badges.active,
            VIP: client.emotes.badges.vip
        }

        const flags = {
            DISCORD_EMPLOYEE: '<:discordstaff:868235527059537960>',
            DISCORD_PARTNER: '<:serverownerpartner:868235522139619418>',
            BUGHUNTER_LEVEL_1: '<:bughunter1:868235523167240342>',
            BUGHUNTER_LEVEL_2: '<:bughunter2:868235521099444374>',
            HYPESQUAD_EVENTS: '<:hypesquadevents:868235528103944232>',
            HOUSE_BRAVERY: '<:hypesquadbravery:868235530020716584>',
            HOUSE_BRILLIANCE: '<:hypesquadbrilliance:868235525834817536>',
            HOUSE_BALANCE: '<:hypesquadbalance:868235523657965579>',
            EARLY_SUPPORTER: '<:earlysupporter:868235524882722866>',
            SYSTEM: 'System',
            VERIFIED_BOT: '<:verifiedbot:868235529039265842>',
            VERIFIED_DEVELOPER: '<:verifiedbotdev:853642406121439273>'
        }

        const user = interaction.guild.members.cache.get(interaction.targetId);

        Schema.findOne({ User: user.id }, async (err, data) => {
            if (data) {
                let Badges = await model.findOne({ User: user.id });

                let credits = 0;
                const creditData = await CreditsSchema.findOne({ User: user.id });

                if (Badges && Badges.FLAGS.includes("DEVELOPER")) {
                    credits = "∞";
                }
                else if (creditData) {
                    credits = creditData.Credits;
                }

                if (!Badges) Badges = { User: user.id };

                const userFlags = user.flags ? user.flags.toArray() : [];

                client.embed({
                    title: `${client.user.username}・Profile`,
                    desc: '_____',
                    thumbnail: user.avatarURL({ dynamic: true }),
                    fields: [{
                        name: "👤┆User",
                        value: user.username,
                        inline: true
                    },
                    {
                        name: "📘┆Discriminator",
                        value: user.discriminator,
                        inline: true
                    },
                    {
                        name: "🆔┆ID",
                        value: user.id,
                        inline: true
                    },
                    {
                        name: "👨‍👩‍👦┆Gender",
                        value: `${data.Gender || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🔢┆Age",
                        value: `${data.Age || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🎂┆Birthday",
                        value: `${data.Birthday || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🎨┆Favorite color",
                        value: `${data.Color || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🐶┆Favorite pets",
                        value: `${data.Pets.join(', ') || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🍕┆Favorite food",
                        value: `${data.Food.join(', ') || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🎶┆Favorite songs",
                        value: `${data.Songs.join(', ') || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🎤┆Favorite artists",
                        value: `${data.Artists.join(', ') || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🎬┆Favorite movies",
                        value: `${data.Movies.join(', ') || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "👨‍🎤┆Favorite actors",
                        value: `${data.Actors.join(', ') || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🏴┆Origin",
                        value: `${data.Orgin || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "🎮┆Hobby's",
                        value: `${data.Hobbys.join(', ') || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "😛┆Status",
                        value: `${data.Status || 'Not set'}`,
                        inline: true
                    },
                    {
                        name: "📛┆Bot Badges",
                        value: `${Badges.FLAGS ? Badges.FLAGS.map(flag => badgeFlags[flag]).join(' ') : 'None'}`,
                        inline: true
                    },
                    {
                        name: "🏷️┆Discord Badges",
                        value: `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None' || 'None'}`,
                        inline: true
                    },
                    {
                        name: "💳┆Dcredits",
                        value: `${credits || 'None'}`,
                        inline: true
                    },
                    {
                        name: "ℹ️┆About me",
                        value: `${data.Aboutme || 'Not set'}`,
                        inline: false
                    },], type: 'editreply'
                }, interaction);
            }
            else {
                return client.errNormal({ error: "No profile found! Open a profile with createprofile", type: 'editreply' }, interaction);
            }
        })
    },
};

// © Dotwood Media | All rights reserved