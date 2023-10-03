const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder
} = require("discord.js");
const DevSchema = require("../../Models/Developer");
const Dev = require("../../Models/ConfDev");
module.exports = {
  premiumOnly: true,
  data: new SlashCommandBuilder()
    .setName("apply-developer")
    .setDescription("Apply for the role @developer")
    .setDMPermission(false),
  async execute(interaction) {
    const DeveloperSetup = await Dev.findOne({ Guild: interaction.guild.id });
    const Developer = await DevSchema.findOne({
      Guild: interaction.guild.id,
      User: interaction.user.id,
    });

    const errEmbed = new EmbedBuilder()
    errEmbed.setColor("Red");

    if (Developer) {
      errEmbed.setDescription("You already have applied for developer applications")
      return interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    };
    if (!DeveloperSetup) {
      errEmbed.setDescription("⛔ | Developer applications are not yet setup");
      return interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    }
    console.log(DeveloperSetup)
    if (DeveloperSetup.Status == true) {
      errEmbed.setDescription("⛔ | The applications are currently closed!")
      return interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    }
    if (interaction.member.roles.cache.has("1091125125677600768")) {
      errEmbed.setDescription("⛔ | Hold up! You are already a developer")
      return interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    }

    const application = new ModalBuilder()
      .setCustomId("developerModal")
      .setTitle("Apply for developer");

    const username = new TextInputBuilder()
      .setCustomId("usernameBuilder")
      .setLabel("Contact Username")
      .setValue(`${interaction.user.tag}`)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const wwyd = new TextInputBuilder()
      .setCustomId("wwydBuilder")
      .setLabel("Why do you want to be a developer")
      .setPlaceholder("Explain briefly")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const about = new TextInputBuilder()
      .setCustomId("abty")
      .setLabel("About Yourself")
      .setPlaceholder("Explain a bit about yourself")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const socials = new TextInputBuilder()
      .setCustomId("socialsBuilder")
      .setLabel("Portfolio/Github")
      .setPlaceholder("Do you have any portfolio or a github account")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const yfe = new TextInputBuilder()
      .setCustomId("yoeBuilder")
      .setLabel("Years of Experience")
      .setPlaceholder("How many years/month of experience")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().setComponents(username);
    const secondActionRow = new ActionRowBuilder().setComponents(wwyd);
    const thirdActionRow = new ActionRowBuilder().setComponents(socials);
    const fourthActionRow = new ActionRowBuilder().setComponents(about);
    const fiftActionRow = new ActionRowBuilder().setComponents(yfe);

    application.setComponents(
      firstActionRow,
      fiftActionRow,
      fourthActionRow,
      secondActionRow,
      thirdActionRow,
    );

    try {
      await interaction.showModal(application);
    } catch (e) {
      interaction.reply({ content: `${e}`, ephemeral: true });
      console.log(e);
    }
  },
};
