const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const automod = require("../../Schemas/automod");
const Reply = require("../../Utils/Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Enable a automod plugin in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("action")
        .setDescription("Enable or disable")
        .addChoices(
          {
            name: "Enable",
            value: "Enable",
          },
          {
            name: "Disable",
            value: "Disable",
          }
        )
        .setRequired(true)
    )
    .addChannelOption((options) =>
      options
        .setName("log-channel")
        .setDescription("Add a log channel to send the logs")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("time")
        .setDescription("Please provide a time so the bot can timeout the guy")
        .addChoices(
          { name: "1 minute", value: "1m" },
          { name: "10 minute", value: "10m" },
          { name: "1 day", value: "1d" },
          { name: "1 week", value: "1w" },
          { name: "30 days", value: "30d" }
        )
    )
    .addStringOption((options) =>
      options
        .setName("plugin")
        .setDescription("Select a plugin to enable with automod")
        .addChoices(
          {
            name: "AntiUnverifiedBot",
            value: "AntiUnverifiedBot",
          },
          {
            name: "AntiSwear",
            value: "AntiSwear",
          },
          {
            name: "AntiScam",
            value: "AntiScam",
          },
          {
            name: "AntiLink",
            value: "AntiLink",
          },
          {
            name: "AntiPing",
            value: "AntiPing",
          },
          {
            name: "AntiAltAccount",
            value: "AntiAltAccount",
          },
          {
            name: "AntiSpam",
            value: "AntiSpam",
          },
          {
            name: "AntiCaps",
            value: "AntiCaps",
          },
          {
            name: "AntiNsfw",
            value: "AntiNsfw",
          },
          {
            name: "All (Every single plugin)",
            value: "All",
          }
        )
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    let Data = await automod.findOne({ Guild: guild.id });
    let plugin = await options.getString("plugin");
    let logChannel = await options.getChannel("log-channel");
    let time = await options.getString("time");
    if (!plugin) plugin = "All";
    let action = await options.getString("action");
    switch (action) {
      case "Enable":
        Enable(plugin, guild, Data, interaction, logChannel, time);
        break;
      case "Disable":
        Disable(plugin, Data, interaction);
        break;
    }
  },
};

//functions

async function Disable(plugin, data, interaction) {
  if (!data) {
    return Reply(interaction, ":x:", "You don't have any plugins enabled");
  } else {
    switch (plugin) {
      case "All":
        data.AntiUnverifiedBot = false;
        data.AntiSwear = false;
        data.AntiScam = false;
        data.AntiLink = false;
        data.AntiPing = false;
        data.AntiAltAccount = false;
        data.AntiSpam = false;
        data.AntiCaps = false;
        data.AntiNsfw = false;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        break;
      case "AntiUnverifiedBot":
        if (data.AntiUnverifiedBot == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiUnverifiedBot == true) data.AntiUnverifiedBot = false;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        data.save();
        break;
      case "AntiSwear":
        if (data.AntiSwear == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiSwear == true) data.AntiSwear = false;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        data.save();
        break;
      case "AntiScam":
        if (data.AntiScam == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiScam == true) data.AntiScam = false;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        data.save();
        break;
      case "AntiLink":
        if (data.AntiLink == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiLink == true) data.AntiLink = false;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        data.save();
        break;
      case "AntiPing":
        if (data.AntiPing == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiPing == true) data.AntiPing = false;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        data.save();
        break;
      case "AntiAltAccount":
        if (data.AntiAltAccount == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiAltAccount == true) data.AntiAltAccount = false;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        data.save();
        break;
      case "AntiSpam":
        if (data.AntiSpam == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiSpam == true) data.AntiSpam = false;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        data.save();

      case "AntiCaps":
        if (data.AntiCaps == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiCaps == true) data.AntiCaps = false;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugin has been disabled`,
          true
        );
        data.save();
        break;
      case "AntiNsfw":
        if (data.AntiNsfw == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiNsfw == true) data.AntiNsfw = false;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been disabled`,
          true
        );
        break;
    }
  }
}

async function Enable(plugin, guild, data, interaction, log, timeout) {
  if (!data) {
    let DB;
    switch (plugin) {
      case "All":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: true,
          AntiSwear: true,
          AntiScam: true,
          AntiLink: true,
          AntiPing: true,
          AntiAltAccount: true,
          AntiSpam: true,
          AntiCaps: true,
          AntiNsfw: true,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugins has been enabled`,
          true
        );
        break;
      case "AntiUnverifiedBot":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: true,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
          AntiNsfw: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiSwear":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: false,
          AntiSwear: true,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
          AntiNsfw: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} the plugins have been enabled`,
          true
        );
        break;
      case "AntiScam":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: true,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
          AntiNsfw: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiLink":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: true,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
          AntiNsfw: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiPing":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: true,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
          AntiNsfw: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiAltAccount":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: true,
          AntiSpam: false,
          AntiCaps: false,
          AntiNsfw: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiSpam":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: true,
          AntiCaps: false,
          AntiNsfw: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );

      case "AntiCaps":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: true,
          AntiNsfw: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiNsfw":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
          AntiNsfw: true,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
    }
  } else {
    switch (plugin) {
      case "All":
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.AntiUnverifiedBot = true;
        data.AntiSwear = true;
        data.AntiScam = true;
        data.AntiLink = true;
        data.AntiPing = true;
        data.AntiAltAccount = true;
        data.AntiSpam = true;
        data.AntiCaps = true;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} plugins has been enabled`,
          true
        );
        break;
      case "AntiUnverifiedBot":
        if (data.AntiUnverifiedBot == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiUnverifiedBot == false) data.AntiUnverifiedBot = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiSwear":
        if (data.AntiSwear == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiSwear == false) data.AntiSwear = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiScam":
        if (data.AntiScam == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiScam == false) data.AntiScam = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiLink":
        if (data.AntiLink == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiLink == false) data.AntiLink = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiPing":
        if (data.AntiPing == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiPing == false) data.AntiPing = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiAltAccount":
        if (data.AntiAltAccount == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiAltAccount == false) data.AntiAltAccount = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiSpam":
        if (data.AntiSpam == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        data.LogChannel = log.id;
        data.Timeout = timeout;
        if (data.AntiSpam == false) data.AntiSpam = true;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        data.save();

      case "AntiCaps":
        if (data.AntiCaps == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        data.LogChannel = log.id;
        data.Timeout = timeout;
        if (data.AntiCaps == false) data.Caps = true;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiCaps":
        if (data.AntiCaps == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiCaps == false) data.AntiCaps = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiNsfw":
        if (data.AntiNsfw == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiNsfw == false) data.AntiNsfw = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
    }
  }
}
