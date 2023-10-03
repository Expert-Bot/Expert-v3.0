const {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ChatbotDB = require("../../Schemas/Chatbot");
const Reply = require("../../chatsys/Reply");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("enable-chatbot")
    .setDescription("Enable chatbot system in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription("Select the channel where threads will be create")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    let channel = await options.getChannel("channel");
    const DataDB = await ChatbotDB.findOne({ GuildID: guild.id });
    if (DataDB) {
      return Reply(
        interaction,
        ":x:",
        `**Chatbot System** is already enabled by <@${DataDB.Mod}>`
      );
    }
    if (!DataDB) {
      const SuccessEmbed = new EmbedBuilder()
        .setTitle("Chatbot System")
        .setDescription(
          `:white_check_mark: | You have successfully enabled **Chatbot System**`
        )
        .setColor("Random");
      const Embed = new EmbedBuilder()
        .setTitle("Chatbot System")
        .setDescription(
          `:white_check_mark: | Use \`/start-chat\` to chat me with me :-)`
        )
        .setColor("Random");

      interaction.reply({
        content: `Visit ${channel} to chat`,
        embeds: [SuccessEmbed],
      });

      channel.send({ embeds: [Embed] });

      const newChatBotData = new ChatbotDB({
        GuildID: guild.id,
        Channel: channel.id,
        Mod: user.id,
        Date: Date.now(),
      });
      await newChatBotData.save();
    }
  },
};
