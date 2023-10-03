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
    .setName("delete-chat")
    .setDescription("Delete a users chat")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
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
    if (!ThreadData) {
      return Reply(interaction, ":x:", `This user doesn't have a chat`, true);
    }
    if (ThreadData) {
      const Thread = await guild.channels.fetch(ThreadData.Thread);
      if (!Thread) {
        Reply(
          interaction,
          ":x:",
          "This chat has been explicitly deleted",
          true
        );
      }
      await Thread.delete(ThreadData.Thread).then(async () => {
        const Embed = new EmbedBuilder()
          .setTitle("Deleted Chat")
          .setDescription(
            `<@${Target.id}> ${interaction.user.username} deleted the chat`
          )
          .setColor("Random");
        await Target.send({ embeds: [Embed] });
        interaction.reply({
          content: `Deleted the chat`,
          ephemeral: true,
        });
        await ChatbotThreadsDB.findOneAndDelete({ GuildID: guild.id, UserID: Target.id });
      });
      return;
    }
  },
};
