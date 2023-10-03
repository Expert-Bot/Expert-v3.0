const { EmbedBuilder } = require('discord.js');
const countingSchema = require('../../Schemas/countingSchema');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const countingData = await countingSchema.findOne({ Guild: message.guild.id });
        if (!countingData) return;

        if (message.channel.id !== countingData.Channel) return;

        const number = parseInt(message.content);

        if (isNaN(number) || number.toString() !== message.content) return;

        if (countingData.Count === 0) {
            if (number !== 1) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Incorrect Number')
                    .setDescription('You must type 1 before continuing onto other numbers.')
                    .setTimestamp()
                    .setFooter({ text: `Incorrect Number At` })
                    .setColor('Red');

                await message.channel.send({ embeds: [errorEmbed] });
                return;
            }
        }

        if (number === countingData.Count + 1) {
            countingData.Count++;
            await countingData.save();

            const response = new EmbedBuilder()
                .setTitle(`Current number: ${countingData.Count}`)
                .setColor('Green');

            const reaction = await message.channel.send({ embeds: [response] });
            await reaction.react('<:SW_Icons_rverification:1106291119563735080>');

            // Check if the maximum count has been reached
            if (countingData.Count === countingData.MaxCount) {
                const congratulationsEmbed = new EmbedBuilder()
                    .setTitle('Congratulations!')
                    .setDescription(`${message.author.username}, you have reached the goal of **${countingData.MaxCount}**! Well done!`)
                    .setTimestamp()
                    .setFooter({ text: `Game Complete` })
                    .setColor('Gold');

               
                const congratsReact = await message.channel.send({ embeds: [congratulationsEmbed] });
                congratsReact.react('🏆')


                countingData.Count = 0; // Reset count to 0
                await countingData.save();
            }
        } else {
            const wrongNumberEmbed = new EmbedBuilder()
                .setTitle('Wrong Number')
                .setDescription(`${message.author.username} has ruined the fun at number **${countingData.Count}**.`)
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: `Wrong Number` })

            await message.channel.send({ embeds: [wrongNumberEmbed] });

            countingData.Count = 0; // Reset count to 0
            await countingData.save();
        }
    },
};