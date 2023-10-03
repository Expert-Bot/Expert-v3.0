const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ChatbotDB = require("../../Schemas/Chatbot");
const ChatbotThreadsDB = require("../../Schemas/ChatbotThreadData");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("start-chat")
    .setDescription("Use this command to start a chat")
    .addStringOption((options) =>
      options
        .setName("type")
        .setDescription("Select the type of chatbot you want to chat with")
        .addChoices(
          { name: "BrainShop (Recommended)", value: "BrainShop" },
          {
            name: "ChatGPT (text-davinci-003)",
            value: "ChatGPT",
          },
          {
            name: "System (Not Recommended)",
            value: "System",
          }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const { user, guild, options } = interaction;
    const Data = await ChatbotDB.findOne({ GuildID: guild.id }).catch(
      (err) => {}
    );
    const ThreadData = await ChatbotThreadsDB.findOne({
      GuildID: guild.id,
      UserID: user.id,
    }).catch((err) => {});
    if (!Data) {
      return Reply(
        interaction,
        ":x:",
        "Couldn't find any chatbot data for this guild",
        true
      );
    }
    if (ThreadData) {
      const threads1 = await guild.channels.fetch(ThreadData.Thread);
      return Reply(
        interaction,
        ":x:",
        `You already have a chat, visit ${threads1}`,
        true
      );
    } else if (!ThreadData) {
      const Channel = await guild.channels.fetch(Data.Channel);
      if (interaction.channel.id !== Data.Channel)
        return Reply(
          interaction,
          ":x:",
          `This command can only be used in ${Channel}`
        );
      const thread = await interaction.channel.threads.create({
        name: `${interaction.user.username}'s chat`,
        autoArchiveDuration: 60,
        reason: "Thread for chatting with the bot",
      });
      let Embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(
          `I have gone ahead and created ${thread} for you to chat with me\n**PRO TIP:** *Be sure to use \`/stopChat\` after you are done chatting with me*`
        );
      const type = await options.getString("type");
      thread.send({ embeds: [Embed] });
      const NewData1 = new ChatbotThreadsDB({
        GuildID: interaction.guild.id,
        UserID: interaction.user.id,
        Thread: thread.id,
        Type: type,
      });
      interaction.reply({
        content: `Your thread has been created, Chat with me in ${thread}`,
        ephemeral: true,
      });
      NewData1.save();
      return;
    }
  },
};
