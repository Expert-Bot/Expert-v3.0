
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

const modSchema = require("../../Schemas/moderation/modSchema");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modlogs")
    .setDescription("Setup or edit the modlogs.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup the modlogs.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the message to.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("replace_channel")
        .setDescription("Replace the channel for the modlogs.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the message to.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Deletes config for the modlogs.")
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const getSubCommand = interaction.options.getSubcommand();
    if (getSubCommand === "setup") {
      const { options } = interaction;
      const channel = options.getChannel("channel");
      const modSys = await modSchema.findOne({
        guildId: interaction.guild.id,
      })
  
      if(modSys === interaction.guild.id) {
        interaction.reply({
          content: "Modlogs are already setup!",
        })
        return;
      }

      const newModlogs = new modSchema({
        _id: mongoose.Types.ObjectId(),
        guildId: interaction.guild.id,
        channelId: channel.id,
      });

      newModlogs.save().catch((err) => console.log(err));
      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Modlogs setup!")
              .setDescription(
                `Modlogs have been successfully setup in ${channel.mention}`
              )
              .setColor(0x00ff00),
          ],
          ephemeral: true,
        })
        .catch((err) => console.log(err));
    } else if (getSubCommand === "replace_channel") {
      const { options } = interaction;
      const channel = options.getChannel("channel");
      const modlogs = await modSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (!modlogs) {
        return interaction.reply({
          content: "Modlogs not setup! To setup run `/modlogs setup`",
        });
      }

      modSchema
        .findOneAndUpdate(
          { guildId: interaction.guild.id },
          { channelId: channel.id }
        )
        .catch((err) => console.log(err));

      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Modlogs channel replaced!")
              .setDescription(
                `Modlogs channel has been successfully replaced in <#${channel.id}>`
              )
              .setColor(0x00ff00),
          ],
          ephemeral: true,
        })
        .catch((err) => console.log(err));
    } else if(getSubCommand === "delete") {
      const modlogs = await modSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (!modlogs) {
        return interaction.reply({
          content: "Modlogs not setup! To setup run `/modlogs setup`",
        });
      }

      modSchema.findOneAndDelete({
        guildId: interaction.guild.id,
      }).catch((err) => console.log(err));

      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Modlogs deleted!")
              .setDescription(
                `Modlogs have been successfully deleted!`
              )
              .setColor(0x00ff00),
          ],
          ephemeral: true,
        })
        .catch((err) => console.log(err));
    }
  },
};
