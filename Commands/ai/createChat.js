const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ChatbotDB = require("../../Schemas/Chatbot");
const ChatbotThreadsDB = require("../../Schemas/ChatbotThreadData");
const Reply = require("../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-chat")
    .setDescription("Create a users chat")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
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
    )
    .addUserOption((options) =>
      options
        .setName("user")
        .setDescription("Mention a user to create its chat")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { guild, options } = interaction;
    const Data = await ChatbotDB.findOne({ GuildID: guild.id }).catch(
      (err) => {}
    );
    const Target = await options.getUser("user");
    const Type = await options.getString("type");
    const ThreadData = await ChatbotThreadsDB.findOne({
      GuildID: guild.id,
      UserID: Target.id,
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
      return Reply(interaction, ":x:", `This user already has a chat`, true);
    }
    if (!ThreadData) {
      const Channel = await guild.channels.fetch(Data.Channel);
      const thread = await Channel.threads.create({
        name: `${Target.username}'s chat`,
        autoArchiveDuration: 60,
        reason: "Thread for chatting with the bot",
      });
      const NewThreadData = new ChatbotThreadsDB({
        GuildID: guild.id,
        UserID: Target.id,
        Thread: thread.id,
        Type: Type,
      });
      await NewThreadData.save().then(async () => {
        const Embed = new EmbedBuilder()
          .setTitle("New Chat")
          .setDescription(
            `<@${Target.id}> ${interaction.user.username} created a chat for you with the type ${Type}`
          )
          .setColor("Random");
        await thread.send({ embeds: [Embed] });
        interaction.reply({
          content: `Created ${thread} with the type ${Type}`,
          ephemeral: true,
        });
        return;
      });
    }
  },
};
