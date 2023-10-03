const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    AttachmentBuilder,
    ButtonStyle,
    ComponentType,
    SlashCommandBuilder,
  } = require("discord.js");
  const { getBardResponse } = require("../Handlers/functions");
  const GuildSettings = require("../Models/GuildSettings");
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ask")
      .setDescription("Ask Bard.")
      .addStringOption((option) =>
        option
          .setName("quesiton")
          .setDescription("Ask Question to Bard.")
          .setRequired(true)
      ),
  
    async execute(client, interaction) {
      try {
        interaction.deferReply()
        const question = interaction.options.getString("question");
        let guildSettings = await GuildSettings.findOne({
          guildId: interaction.guild.id,
        });
        if (!guildSettings) {
          guildSettings = new GuildSettings({ guildId: interaction.guild.id });
          guildSettings.save();
        }
        const answer = await getBardResponse(`${question}`);
        await interaction.editReply(answer);
      } catch (e) {
        console.log(e);
      }
    },
  };