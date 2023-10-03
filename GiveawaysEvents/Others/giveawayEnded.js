const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'giveawayEnded',
    execute(giveaway, winners) {
        winners.forEach((winner) => {
            return winner.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('🎁 Congratulations!')
                        .setDescription(`Congratulations, you won the [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!\nYour prize is: \`${giveaway.prize}\``)
                ]
            }).catch(() => { });
        });
    }
}