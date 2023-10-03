const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Ask the 8ball")
        .addStringOption(option =>
            option.setName("question")
                .setDescription("Ask the 8ball a question")
                .setRequired(true)
        ),
    async execute(interaction) {

        let eightball = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
            'No way.',
            'Maybe',
            'The answer is hiding inside you',
            'No.',
            'Depends on the mood of the CS god',
            '||No||',
            '||Yes||',
            'Hang on',
            'It\'s over',
            'It\'s just the beginning',
            'Good Luck',
        ];
        let index = (Math.floor(Math.random() * Math.floor(eightball.length)));
        setTimeout(() => {
            interaction.reply({
                content: eightball[index],
            });
        }, 750);
    }
};