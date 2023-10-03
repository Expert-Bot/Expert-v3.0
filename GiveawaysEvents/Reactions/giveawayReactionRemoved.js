const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'giveawayReactionRemoved',
    execute(giveaway, member) {
        return member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🤔 Leave from the giveaway?')
                    .setDescription(`I noticed you left the [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}).\nGiveaway prize: \`${giveaway.prize}\`.\nIs this a mistake? Join again!`)
            ]
        })
    }
}