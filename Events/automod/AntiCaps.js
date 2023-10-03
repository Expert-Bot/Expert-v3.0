//Defining
const { Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const automod = require("../../Schemas/automod");
// Declare an object to track last message times for users
const lastMessageTimes = {};

module.exports = {
  //Emiting the messageCreate event
  name: "messageCreate",
  /**
 * 

 * @param {Client} client 
 */
  async execute(message, client) {
    //Checks if the place if guild or not, Checks if the user is a bot or not if yes then return;, Checks if the user has appropraite permissions to bypas this, if yes then return;
    if (
      !message.guild ||
      message.author.bot ||
      message.member.permissions.has(PermissionFlagsBits.ManageMessages)
    )
      return;
    // Inside the messageCreate event handler

    //Checker, It keeps a track so the bot doesn't spam warning messages
    const currentTime = Date.now();
    const lastSentTime = lastMessageTimes[message.author.id] || 0;
    const timeDifference = currentTime - lastSentTime;
    //Change the time
    lastMessageTimes[message.author.id] = currentTime;
    //Guild
    const guild = message.guild;
    //Finding automod data from the database
    let requireDB = await automod.findOne({ Guild: guild.id });

    //Checking if there is automod data in the database or not if no then return; also it keeps a check on the database another property called AntiCaps if its false then it will return nothing
    if (!requireDB) return;
    if (requireDB.AntiCaps == false) return;
    //Q is message's content
    let q = message.content;

    //Checking if the message is uppercase or not
    if (q.length > 15 && q == q.toUpperCase()) {
      message.delete();

      //Builds an embed for the warning message
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          `:warning: | <@${message.author.id}> Please try sending messages with lower volume.`
        );
      //Another part of the bot spamming, It checks if the bot before messages sent are about 3.5 secs or not, If no then return nothing.
      if (timeDifference < 3500) {
        // If the user has sent a message recently, return early
        return;
      }
      //Sends the message
      const msg = await message.channel.send({ embeds: [embed] });

      //Delete the warning message after 8.5 seconds
      setTimeout(async () => {
        await msg.delete();
      }, 8500);
    } else {
      //returns nothing if the requirements are not met!
      return;
    }
  },
};
