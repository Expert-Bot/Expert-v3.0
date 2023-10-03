//Some important defining
const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const UserAM = require("../../Schemas/userAutomod");
const automod = require("../../Schemas/automod");
const BlockedKeyWords = require("../../Schemas/BlockedKeywords");
const ms = require("ms");
// Declare an object to track last message times for users
const lastMessageTimes = {};

module.exports = {
  //emitting a messageCreate event
  name: "messageCreate",
  /**
   * 
  
   * @param {Client} client 
   */
  async execute(message, client) {
    //Checks for the appropriate permissions if yes then return nothing
   if (message.member && message.member.permissions.has(PermissionFlagsBits.ManageMessages))
  return;
    //Check if the message author is a bot or not
    if (message.author.bot) return;

    //A checker to avoid bot spamming the warning message
    const currentTime = Date.now();
    const lastSentTime = lastMessageTimes[message.author.id] || 0;
    const timeDifference = currentTime - lastSentTime;

    lastMessageTimes[message.author.id] = currentTime;

    //Searches for AutoMod in the database using mongoose
    const AutoMod = await automod.findOne({ Guild: message.guild.id });
    //Searches For UserAutoMod in the database using mongoose!
    const User = await UserAM.findOne({
      Guild: message.guild.id,
      User: message.author.id,
    });
    //If theres no Automod and it will return nothing
    if (!AutoMod) return;

    //KeyWord Checking
    const messageContent = message.content.toLowerCase(); // Get the content of the message and convert it to lowercase for case-insensitive matching

    //Checks for the data in the database using mongoose and also distincts "KeyWord"
    const KeyWordBlocked = await BlockedKeyWords.findOne({
      Guild: message.guild.id,
    }).distinct("KeyWord");
    //Creates a new embed for the warning message
    const embed = new EmbedBuilder()
      .setDescription(
        `:warning: | <@${message.author.id}> has sent a blocked keyword.`
      )
      .setColor("Yellow");

    //Finds the LogChannel to send the log to
    const LogChannel = await message.guild.channels.cache.get(
      AutoMod.LogChannel
    );

    // Check if the message content contains any blocked keyword, If no then exits the case
    if (containsBlockedKeyword(KeyWordBlocked, messageContent)) {
      //Deletes the message!
      await message.delete();

      //UserAM checker if there is no data then it will create one if there is then it will kick/timeout the member depending on the case
      if (!User) {
        let u;
        u = new UserAM({
          Guild: message.guild.id,
          User: message.author.id,
          InfractionPoints: 1,
        });
        User.save();
      } else {
        //If no member then return nothing;
        if (!message.member) return;
        //Adds the users infractions points for later on
        User.InfractionPoints += 1;
        User.save();
        //The bot avoiding function continueing here it will check if the bot has already sent a message in 3.5 seconds before sending another if its true then it won't return anything
        if (timeDifference < 3500) {
          return;
        }
        //Normal case checking
        const Timeout = AutoMod.Timeout;
        const TimeToTimeOut = ms(Timeout);
        switch (User.InfractionPoints) {
          case 5:
            await message.member.timeout(TimeToTimeOut).then(async () => {
              message.member.send({
                content: "You have been timed out",
                embeds: [
                  new EmbedBuilder()
                    .setTitle("TimedOut")
                    .setDescription(
                      `You have been timed out from \`${message.guild.name}]\` for sending a blocked keyword`
                    )
                    .setColor("Aqua"),
                ],
              });
            });
            break;
          case 10:
            await message.member
              .kick({ reason: "Kicked for sending Blocked Keywords!" })
              .then(async () => {
                message.member.send({
                  content: "You have been kicked",
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Kicked")
                      .setDescription(
                        `You have been kicked from \`${message.guild.name}\` for sending a blocked keyword`
                      )
                      .setColor("Aqua"),
                  ],
                });
              });
            break;
        }
      }
      //Sends a msg to the channel where the blocked message was sent
      const msg = await message.channel.send({ embeds: [embed] });
      setTimeout(async () => {
        //Deletes the warning message after 8.5 seconds
        await msg.delete();
      }, 8500);
      //Creates new amazing buttons for the admins or mods to take action against the user
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Timeout")
          .setCustomId("timeout")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setLabel("Kick")
          .setCustomId("kick")
          .setStyle(ButtonStyle.Danger)
      );

      //Finnaly sends the log to the automod log channel
      const text = await LogChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `<@${message.author.id}> has sent a keyword that is blocked.\n\`\`\`${message.content}\`\`\``
            ),
        ],
        components: [buttons],
      });

      //Creates a collector so the admins or mods can interact with the buttons
      const col = await text.createMessageComponentCollector();
      col.on("collect", async (m) => {
        //Checks if the user has appropriate permissions or not
        if (!m.member.permissions.has(PermissionFlagsBits.ModerateMembers))
          return m.reply({
            content: "You don't have permission to timeout",
            ephemeral: true,
          });
        //If not a member of the server then kick the user
        if (!message.member) {
          return m.reply({
            content: "This user doesn't exist",
            ephemeral: true,
          });
        }
        //Switch to the customId and then use the id to take the action, Its self explanatory you will understand it yourself
        switch (m.customId) {
          case "timeout":
            const embed = new EmbedBuilder()
              .setTitle("Timeout")
              .setDescription(
                `You have received a timeout from \`${message.guild.name}\` for sending blocked words`
              )
              .setColor("Red");
            m.reply({
              content: `Timed out ${message.author.tag}`,
              ephemeral: true,
            });
            message.member
              .send({
                embeds: [embed],
              })
              .then(() => {
                const time = ms(AutoMod.Timeout);
                message.member.timeout(time);
              });
            break;
          case "kick":
            const embedss = new EmbedBuilder()
              .setTitle("Kicked")
              .setDescription(
                `You have been kicked from \`${message.guild.name}\` for sending sending blocked words`
              )
              .setColor("Red");
            m.reply({
              content: `Kicked ${message.author.tag}`,
              ephemeral: true,
            });
            message.member
              .send({
                embeds: [embedss],
              })
              .then(() => {
                message.member.kick({ reason: "Sending Blocked Words" });
              });
            break;
        }
      });
    }
  },
};

function containsBlockedKeyword(data, content) {
  return data.some((keyword) => content.includes(keyword.toLowerCase()));
}
