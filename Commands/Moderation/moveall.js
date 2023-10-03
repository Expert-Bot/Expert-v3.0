const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName('moveall')
    .setDescription('Move all members in the specified channel to target channel')
    .addChannelOption(option =>
      option.setName('source')
        .setDescription('The source channel of the member to be moved')
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('target')
        .setDescription('The target channel to move the member to')
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)),

  async execute(interaction) {
    const sourceChannel = interaction.options.getChannel('source');
    const targetChannel = interaction.options.getChannel('target');

    await sourceChannel.members.forEach(member => {
      member.voice.setChannel(targetChannel);
    });

    return interaction.reply({ content: 'Done.', ephemeral: true });
  },
};