const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'giveawayReactionAdded',
    execute(giveaway, member, reaction) {
        return member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`👏 Good job!`)
                    .setDescription(`Great, you entered the [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!\nGiveaway prize: \`${giveaway.prize}\`\nGood luck!`)
            ]
        }).catch(() => { });
    }
}