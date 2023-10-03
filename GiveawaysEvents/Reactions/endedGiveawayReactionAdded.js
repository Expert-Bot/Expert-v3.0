const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'endedGiveawayReactionAdded',
    execute(giveaway, member, reaction) {
        reaction.users.remove(member.user);
        return member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🤔 Mistake?')
                    .setDescription(`Oops, apparently you entered an already ended [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!\nProbably a mistake...`)
            ]
        }).catch(() => { });
    }
}