//Importing neccessary modules
const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const UserAM = require("../../Schemas/userAutomod");
const automod = require("../../Schemas/automod");
const antiLink = require("../../Schemas/AntiAllowedLinks");
const antiLinkChannel = require("../../Schemas/AllowedLinkChannels");
const ms = require("ms");
// Declare an object to track last message times for users
const lastMessageTimes = {};

module.exports = {
  name: "messageCreate",
  /**
 * 

 * @param {Client} client 
 */
  async execute(message, client) {
    //Checking for cases
    if (
      !message.guild ||
      message.author.bot ||
      message.member.permissions.has(PermissionFlagsBits.ManageMessages)
    )
      return;

    // Part where the bot is being spammy with the warning message, this is here avoid that
    const currentTime = Date.now();
    const lastSentTime = lastMessageTimes[message.author.id] || 0;
    const timeDifference = currentTime - lastSentTime;

    lastMessageTimes[message.author.id] = currentTime;

    //Finds appropriate messages from the database
    const AntiLinkChannels = await antiLinkChannel.findOne({
      Guild: message.guild.id,
    });

    const sentLink = message.content; // Replace with the actual link you sent
    const regexPattern = /^https?:\/\/(?:www\.)?([^/]+)/i;

    // Extract the base URL from the sent link
    const match = sentLink.match(regexPattern);
    const sentBaseURL = match ? match[1] : null;

    // Query the database to find a matching base URL
    const AntiLink = await antiLink.findOne({
      Guild: message.guild.id,
      Link: { $regex: `^https?:\/\/(?:www\.)?${sentBaseURL}`, $options: "i" },
    });

    //Skips if the channel id is equal to the allowed channel id and if there is a error then it won't return anything
    try {
      if (AntiLinkChannels.Channel == message.channel.id) {
        return;
      }
    } catch (e) {}

    //Checks if there is a matching base URL or not
    if (!AntiLink) {
      //Guild
      const guild = message.guild;
      //Defined the automod
      let requireDB = await automod.findOne({ Guild: guild.id });
      //Finds the userData
      let UserData = await UserAM.findOne({
        Guild: guild.id,
        User: message.author.id,
      });
      //Defines the cases when finding the database
      if (!requireDB) return;
      if (!requireDB.AntiLink) return;
      //defined a regex that will be used to test the link
      const ragex =
        /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
      //Constructs a embed for the warning message
      const embed = new EmbedBuilder()
        .setDescription(`:warning: | <@${message.author.id}> has sent a link.`)
        .setColor("Yellow");
      //Defines a log channel from the database which will be used to log the messages for admins and mods
      const logChannel = message.guild.channels.cache.get(requireDB.LogChannel);
      //Tests the rages of the message.content
      if (ragex.test(message.content)) {
        //deletes the message
        message.delete();

        //Checks if the UserAutomod exists or not if not then it creates anew one
        if (!UserData) {
          const newData = new UserAM({
            Guild: guild.id,
            User: message.author.id,
            InfractionPoints: 1,
          });
          //Saves the data to the database
          newData.save();
        } else {
          //Adds the infraction points to the database of the user and saves it
          UserData.InfractionPoints += 1;
          UserData.save();
          if (timeDifference < 3500) {
            // If the user has sent a message recently, return early
            return;
          }
          if (!message.member) return;
          //Punishments if the infraction points are too high
          switch (UserData.InfractionPoints) {
            case 5:
              const time = ms(requireDB.Timeout);
              await message.member.timeout(time);
              logChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                      `<@${message.author.id}> has been timed out for sending links\n`
                    ),
                ],
              });
              break;

            case 10:
              logChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                      `<@${message.author.id}> has been kicked for sending links`
                    ),
                ],
              });
              const data = await UserAM.deleteMany({
                Guild: guild.id,
                User: message.author.id,
              });
              if (!data) {
              }
              then(async () => {
                logChannel
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                          `<@${message.author.id}> has been kicked for sending links`
                        ),
                    ],
                  })
                  .then(async () => {
                    await message.member.kick({
                      reason: "Sending unallowed links",
                    });
                  });
              });
              break;
          }
        }
        //Sends the warning message to the channel where link has been sent
        const msg = await message.channel.send({ embeds: [embed] });

        //Deletes the message after 8.5 seconds
        setTimeout(async () => {
          await msg.delete();
        }, 5000);

        //Defines new buttons for the admins or mods to take action against the users
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("TimeOut")
            .setCustomId("timeout")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setLabel("Kick")
            .setCustomId("kick")
            .setStyle(ButtonStyle.Danger)
        );

        //Sends the log to the log channel for admins or mods
        const text = await logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `<@${message.author.id}> has sent a link.\n\`\`\`${message.content}\`\`\``
              ),
          ],
          components: [buttons],
        });

        //Creates a new Collector
        const col = await text.createMessageComponentCollector();
        //Defines a new event
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
          //Timeout/Kick?
          switch (m.customId) {
            case "timeout":
              const embed = new EmbedBuilder()
                .setTitle("Timeout")
                .setDescription(
                  `You have received a timeout from \`${message.guild.name}\` for sending links`
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
                  const time = ms(requireDB.Timeout);
                  message.member.timeout(time);
                });
              break;
            case "kick":
              const embedss = new EmbedBuilder()
                .setTitle("Kicked")
                .setDescription(
                  `You have been kicked from \`${message.guild.name}\` for sending links`
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
                  message.member.kick({ reason: "Sending links" });
                });
              break;
          }
        });
      }
    }
  },
};
