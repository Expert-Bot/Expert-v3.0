//Defining the essentials
const {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const automod = require("../../Schemas/automod");
const AntiScam = require("../../Utils/Systems/ScamLinks.json");
const UserAM = require("../../Schemas/userAutomod");
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
    if (!message.guild || message.author.bot) return;

    //Function to avoid the bot being spammy with the warning messages
    const currentTime = Date.now();
    const lastSentTime = lastMessageTimes[message.author.id] || 0;
    const timeDifference = currentTime - lastSentTime;

    lastMessageTimes[message.author.id] = currentTime;
    //Guild
    const guild = message.guild;
    //Defining essentials db for data
    let requireDB = await automod.findOne({ Guild: guild.id });
    let UserData = await UserAM.findOne({
      Guild: guild.id,
      User: message.author.id,
    });

    //Checks for the db we just defined
    if (!requireDB) return;
    if (requireDB.AntiScam == false) return;

    //Maps all the scam links
    const scamlinks = AntiScam.known_links.map(
      (word) => new RegExp(`\\b${word}\\b`, "i")
    );

    //Creates a embed for the warning message
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(
        `:warning: | <@${message.author.id}> has sent a harmful link.`
      );
    //Defines a log channel to send the log for admins and mods
    const logChannel = client.channels.cache.get(requireDB.LogChannel);

    //Loops around the regex
    for (const regex of scamlinks) {
      if (regex.test(message.content)) {
        try {
          await message.delete();
        } catch (err) {
          return;
        }

        if (!UserData) {
          const newData = new UserAM({
            Guild: guild.id,
            User: message.author.id,
            InfractionPoints: 1,
          });
          newData.save();
        } else {
          UserData.InfractionPoints += 1;
          UserData.save();
          if (timeDifference < 3500) {
            // If the user has sent a message recently, return early
            return;
          }
          if (!message.member) return;
          const time = ms(requireDB.Timeout);
          await message.member.timeout(time);
          switch (UserData.InfractionPoints) {
            case 5:
              logChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                      `<@${message.author.id}> has been timed out for sending scam links\n`
                    ),
                ],
              });
              break;
            case 10:
              if (!message.member) return;
              logChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                      `<@${message.author.id}> has been kicked for sending harmful links`
                    ),
                ],
              });
              const data = await UserAM.deleteMany({
                Guild: guild.id,
                User: message.author.id,
              });
              if (!data) {
              }
              then(() => {
                logChannel
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                          `<@${message.author.id}> has been kicked for harmful links`
                        ),
                    ],
                  })
                  .then(async () => {
                    await message.member.kick({
                      reason: "Sending harmful links",
                    });
                  });
              });
              break;
            case 11:
              if (!message.member) return;
              message.channel.send(
                `<@${message.author.id}> this is your last warning to stop sending scam links\nNext time there won't be a warning`
              );
              break;
            case 15:
              if (!message.member) return;
              logChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                      `<@${message.author.id}> has been banned for sending scam links`
                    ),
                ],
              });

              const dat = await UserAM.deleteMany({
                Guild: guild.id,
                User: message.author.id,
              });
              if (!dat) {
              }
              then(() => {
                message.member
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                          `You have been banned from ${message.guild.name} for sending scam links`
                        ),
                    ],
                  })
                  .then(async () => {
                    await message.member.ban({ reason: "Sending Scam Links" });
                  });
              });

              break;
          }
        }

        //Sends the warning message
        const msg = await message.channel.send({ embeds: [embed] });
        //Deletes it after 8.5s
        setTimeout(async () => {
          await msg.delete();
        }, 8500);
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Kick")
            .setCustomId("kick")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setLabel("Ban")
            .setCustomId("ban")
            .setStyle(ButtonStyle.Danger)
        );

        //Sends the log to a channel
        const text = await logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `<@${message.author.id}> has sent a harmful link.\n\`\`\`${message.content}\`\`\``
              ),
          ],
          components: [buttons],
        });
        //Creates the message component collector
        const col = text.createMessageComponentCollector();
        //Handles the buttons
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
          switch (m.customId) {
            case "kick":
              const embed = new EmbedBuilder()
                .setTitle("Kicked")
                .setDescription(
                  `You have been kicked from \`${message.guild.name}\` for sending scam links`
                )
                .setColor("Red");
              m.reply({
                content: `Kicked ${message.author.tag}`,
                ephemeral: true,
              });
              message.member
                .send({
                  embeds: [embed],
                })
                .then(() => {
                  message.member.kick({ reason: "Sending scam links" });
                });
              break;
            case "ban":
              const embedss = new EmbedBuilder()
                .setTitle("Banned")
                .setDescription(
                  `You have been banned from \`${message.guild.name}\` for sending scam links`
                )
                .setColor("Red");
              m.reply({
                content: `Banned ${message.author.tag}`,
                ephemeral: true,
              });
              message.member
                .send({
                  embeds: [embedss],
                })
                .then(() => {
                  message.member.ban({ reason: "Sending scam links" });
                });
              break;
          }
        });
      }
    }
  },
};
