const { EmbedBuilder, CommandInteraction } = require("discord.js");

/**
 * @param {CommandInteraction} interaction - client interaction from Command Interaction
 * @param {*} emoji - emoji for the reply
 * @param {String} description - description for the reply
 */
function EditReply(interaction, emoji, description) {
  interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor("#38b6ff")
        .setDescription(`${emoji} | ${description}`),
    ],
  });
}

module.exports = EditReply;
