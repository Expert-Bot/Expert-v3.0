//Defining
const { Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const UserAM = require("../../Schemas/userAutomod");
const automod = require("../../Schemas/automod");
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

    //A checker to avoid bot spamming the warning message
    const currentTime = Date.now();
    const lastSentTime = lastMessageTimes[message.author.id] || 0;
    const timeDifference = currentTime - lastSentTime;

    lastMessageTimes[message.author.id] = currentTime;

    //Guild
    const guild = message.guild;

    //Finds the required Data from the database
    let requireDB = await automod.findOne({ Guild: guild.id });
    let UserData = await UserAM.findOne({
      Guild: guild.id,
      User: message.author.id,
    });
    //Checks the information about the data just retreived
    if (!requireDB) return;
    if (requireDB.AntiPing == false) return;

    //Defined a log channel for logging the case
    const logChannel = message.guild.channels.cache.get(requireDB.LogChannel);

    //Contructs a embed for the warning
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(
        `:warning: | <@${message.author.id}> tried to ping everyone.`
      );
    //Checks if the message contains @everyone or @here
    if (
      message.content.includes("@everyone") ||
      message.content.includes("@everyone")
    ) {
      //Deletes the message
      message.delete();

      //Checks if the database is present or not, if not then creates a new one
      if (!UserData) {
        const newData = new UserAM({
          Guild: guild.id,
          User: message.author.id,
          InfractionPoints: 1,
        });
        //Saves the data to the database
        newData.save();
      } else {
        //Adds the infraction points and updates the database
        UserData.InfractionPoints += 1;
        UserData.save();
        //Another part of the Bot spamming warning message, Will not return anything until timedifference is higher than 3.5 seconds
        if (timeDifference < 3500) {
          // If the user has sent a message recently, return early
          return;
        }
        if (!message.member) return;
        switch (UserData.InfractionPoints) {
          //Case is 5 for timeout :)
          case 5:
            const time = ms(requireDB.Timeout);
            await message.member.timeout(time);
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(
                    `<@${message.author.id}> has been timed out for pinging everyone`
                  ),
              ],
            });
            break;
          //Case is 10 for Kick
          case 10:
            if (!message.member) return;
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(
                    `<@${message.author.id}> has been kicked for pinging everyone`
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
                        `<@${message.author.id}> has been kicked for pinging everyone`
                      ),
                  ],
                })
                .then(async () => {
                  await message.member.kick({ reason: "Pinging everyone" });
                });
            });
            break;
        }
      }

      //Sends the warning message
      const msg = await message.channel.send({ embeds: [embed] });

      //Deletes the warning message after 8.5 seconds
      setTimeout(async () => {
        await msg.delete();
      }, 8500);

      //Sends the message to the channel
      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `<@${message.author.id}> has pinged \`@\`everyone.\n\`\`\`${message.content}\`\`\``
            ),
        ],
      });
    } else {
      return;
    }
  },
};
