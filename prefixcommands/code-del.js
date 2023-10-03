const { EmbedBuilder, Permissions } = require("discord.js");
const { Code } = require("../Models/codeSchema");

const ERROR_MESSAGES = {
  CODE_NOT_FOUND: "The code you entered is invalid. Please try again.",
  CODE_ALREADY_REDEEMED: "The code you entered has already been redeemed.",
  EXPIRATION_DATE_NOT_FOUND:
    "The code you entered has already been redeemed, but there was an issue retrieving the expiration date.",
};

module.exports = {
  nombre: 'delete-code',
  category: 'Admin',
  adminOnly: true,
  premiumOnly: false,
  description: 'Delete a premium code (Only for Bot owner)',
  usage: ['<prefix>delete-code <code>'],
  run: async (client, message, args) => {
    try {
      const codeValue = args[0];

      const code = await Code.findOne({ code: codeValue });

      if (!code) {
        const embed = new EmbedBuilder()
          .setTitle("Code Deletion Failed")
          .setDescription(ERROR_MESSAGES.CODE_NOT_FOUND)
          .setColor("Red");
        await message.reply({ embeds: [embed] });
        return;
      }

      if (code.redeemedBy && code.redeemedBy.username && code.redeemedBy.id) {
        const confirmEmbed = new EmbedBuilder()
          .setTitle("Code Deletion Confirmation")
          .setDescription(
            `Are you sure you want to delete code "${codeValue}"?\n\nType \`<prefix>delete ${codeValue}\` to confirm.`
          )
          .setColor("Orange");
        const message = await message.reply({
          embeds: [confirmEmbed],
        });

        const filter = (msg) =>
          msg.author.id === message.author.id &&
          msg.content.toLowerCase() === `<prefix>delete ${codeValue}`;

        const collector = message.channel.createMessageCollector({
          filter,
          time: 10000, // 10 seconds
        });

        collector.on("collect", async (msg) => {
          await msg.delete();
          await Code.deleteOne({ _id: code._id });

          const embed = new EmbedBuilder()
            .setTitle("Code Deleted")
            .setDescription("The code has been successfully deleted.")
            .setColor("Green");
          await message.reply({ embeds: [embed] });
        });

        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            const timeoutEmbed = new EmbedBuilder()
              .setTitle("Code Deletion Failed")
              .setDescription(
                "The confirmation timed out. Please try again by running the command again."
              )
              .setColor("Red");
            await message.reply({ embeds: [timeoutEmbed] });
          }
        });

        return;
      }

      await Code.deleteOne({ _id: code._id });

      const embed = new EmbedBuilder()
        .setTitle("Code Deleted")
        .setDescription("The code has been successfully deleted.")
        .setColor("Green");
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setTitle("Command Execution Failed")
        .setDescription(
          "An error occurred while executing this command. Please try again later."
        )
        .setColor("Red");
      await message.reply({ embeds: [embed] });
    }
  },
};

