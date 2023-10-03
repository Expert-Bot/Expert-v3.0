const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Code } = require("../Models/codeSchema");

module.exports = {
  nombre: 'generate-code',
  category: 'Admin',
  adminOnly: true,
  premiumOnly: false,
  description: 'Generate a code (Only for Bot owner)',
  usage: ['<prefix>generate-code <length>'],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply({ content: 'You **do not** have the permission to do that!' });
    }

    const validLengths = ["daily", "weekly", "monthly", "yearly"];
    const codeLength = args[0]?.toLowerCase();
    const codeType = validLengths.includes(codeLength) ? codeLength : "daily";

    const code = Math.random().toString(36).substring(2, 8);
    const newCode = new Code({
      code,
      length: codeType,
    });

    try {
      await newCode.save();
      const embed = new EmbedBuilder()
        .setTitle("Code Generated")
        .setDescription("Your code has been successfully generated.")
        .addFields(
          { name: "Code", value: `${code}`, inline: true },
          { name: "Length", value: `${codeType}`, inline: true }
        )
        .setColor("Green")
        .setTimestamp();
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setTitle("Code Generation Failed")
        .setDescription(
          "An error occurred while generating the code. Please try again later."
        )
        .setColor("Red");
      await message.reply({ embeds: [embed] });
    }
  },
};
