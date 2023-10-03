
const { EmbedBuilder} = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
 
const configuration = new Configuration({
  apiKey: "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" // PASTE YOUR API KEY HERE
});
 
const openai = new OpenAIApi(configuration);
 
module.exports = {
  nombre: 'ask',
  category: 'General',
  description: 'Ask ChatGPT a question',
  usage: ['<prefix>ask <question>'],
  run: async (client, message, args) => {
    const question = args.join(' ');

    if (!question) {
      return message.reply('Please provide a question for ChatGPT.');
    }

    try {
      const res = await openai.createCompletion({
        model: 'text-davinci-003',
        max_tokens: 2048,
        temperature: 0.5,
        prompt: question,
      });

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(`\`\`\`${res.data.choices[0].text}\`\`\``);

      await message.channel.send({ embeds: [embed] });
    } catch (e) {
      return message.reply(`Request failed with status code **${e.response.status}**`);
    }
  },
};
