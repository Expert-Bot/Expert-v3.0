const {
  ContextMenuInteraction,
  EmbedBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("msgTranslate")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false),
  /**
   * 
   * @param {ContextMenuInteraction} interaction 
   */
  async execute(interaction) {
    const { channel, targetId } = interaction

    const query = await channel.messages.fetch(targetId)
    const raw = query.content

    const translated = await translate(query, { to: "en" })

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("0x2f3136")
          .setTitle(`Translated to English Language`)
          .addFields(
            {
              name: `Your text:`,
              value: `\`\`\`${raw}\`\`\``,
            },
            {
              name: `Translated text:`,
              value: `\`\`\`${translated.text}\`\`\``,
            }
          )
          .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL(true) })
          .setTimestamp()
      ]
    })
  }
}