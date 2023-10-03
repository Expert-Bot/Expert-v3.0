const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const DevSchema = require("../../Models/ConfDev");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-developer")
    .setDescription("Only For Bot Owner")
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("action")
        .setDescription("Choose an option.")
        .addChoices(
          {
            name: "Open",
            value: "o",
          },
          {
            name: "Close",
            value: "c",
          }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder();
    const Data = await DevSchema.findOne({ Guild: interaction.guild.id });
    let action = await interaction.options.getString("action");
    let a = null;
    switch (action) {
      case "o":
        action = false;
        a = "Opened";
        break;
      case "c":
        action = true;
        a = "Closed";
        break;
    }
    try {
      if (!Data) {
        const newData = new DevSchema({
          Guild: interaction.guild.id,
          Status: action,
        });
        await newData.save();
        interaction.reply({
          embeds: [
            embed
              .setAuthor({ name: "Config updated", iconURL: "https://kajdev.org/img/400x400_logo.png" })
              .setDescription(`**${a}** the developer applications!`)
              .setTimestamp()
              .setColor("#235ee7"),
          ],
        });
      } else {
        await interaction.reply({
          embeds: [
            embed
              .setAuthor({ name: "Config updated", iconURL: "https://kajdev.org/img/400x400_logo.png" })
              .setDescription(`**${a}** the developer applications!`)
              .setTimestamp()
              .setColor("#235ee7"),
          ],
        });
        Data.Status = action;
        Data.save();
      }
    } catch (err) {
      console.log(err);
      interaction.reply({ embeds: [embed.setDescription(`A error occured`)] });
    }
  },
};
