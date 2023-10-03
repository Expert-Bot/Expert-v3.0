const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const automod = require("../../Schemas/automod");
const antialt = require("../../Schemas/AntiUnverifiedBot");
const Reply = require("../../Utils/Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("anti-unverified-bot-allow")
    .setDescription("Allowed unverified bots by AntiUnverifiedBot system")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((options) =>
      options
        .setName("botid")
        .setDescription("Enter the bot ID to allow the bot to join")
        .setRequired(true)
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const BotID = options.getString("botid");

    let Data = await automod.findOne({ Guild: guild.id });
    let AltUser = await antialt.findOne({ Guild: guild.id });
    if (!Data) {
      return Reply(
        ":x:",
        "Please enable automod before using this command",
        true
      );
    }

    let newDat;

    if (!AltUser) {
      newDat = new antialt({
        Guild: guild.id,
        Bot: BotID,
      });
      newDat.save();
    } else {
      Reply(
        ":white_check_mark:",
        `This entry for the bot is already created and cannot be deleted, Please contact the bot developers, If you want to remove the data`,
        true
      );
    }

    Reply(
      interaction,
      ":white_check_mark:",
      `Created a new entry with the BotID: ${BotID}, This bot now won't be kicked from the server`,
      true
    );
  },
};
