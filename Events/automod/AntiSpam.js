const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

// Map to track message counts for users
const messageCounts = new Map();

const UserAM = require("../../Schemas/userAutomod");
const automod = require("../../Schemas/automod");
const ms = require("ms");

// Declare an object to track last message times for users
const lastMessageTimes = {};

module.exports = {
  name: "messageCreate",
  /**
   * Handle the messageCreate event.
   * @param {Client} client
   */
  async execute(message, client) {
    // Check conditions to skip processing
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return;

    // Track message times
    const currentTime = Date.now();
    const lastSentTime = lastMessageTimes[message.author.id] || 0;
    const timeDifference = currentTime - lastSentTime;

    lastMessageTimes[message.author.id] = currentTime;

    const guild = message.guild;

    // Retrieve data from the database
    let requireDB = await automod.findOne({ Guild: guild.id });
    let UserData = await UserAM.findOne({
      Guild: guild.id,
      User: message.author.id,
    });

    // Check for presence of automod settings
    if (!requireDB) return;
    if (requireDB.AntiSpam == false) return;

    // Define the log channel
    const logChannel = client.channels.cache.get(requireDB.LogChannel);

    // Create a warning embed
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(
        `:warning: | <@${message.author.id}> is suspected of spamming`
      );

    // Define the maximum number of messages a user can send
    const maxMessageCount = 15;

    // Get and increment the message count for the user
    let messageCount = messageCounts.get(message.author.id) || 0;
    messageCount++;
    messageCounts.set(message.author.id, messageCount);

    // Check for excessive messages and take action
    if (messageCount > maxMessageCount) {
      try {
        await message.delete();
      } catch (err) {
        return;
      }

      // Remove the message count after a delay
      setTimeout(() => {
        messageCounts.delete(message.author.id);
      }, 6500);

      // Handle user data and punishments
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
          // Case 5 for timeout
          case 5:
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(
                    `<@${message.author.id}> has been timed out for spamming\n`
                  ),
              ],
            });
            break;
          // Case 10 for kick
          case 10:
            if (!message.member) return;
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(
                    `<@${message.author.id}> has been kicked for spamming`
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
                        `<@${message.author.id}> has been kicked for spamming`
                      ),
                  ],
                })
                .then(async () => {
                  await message.member.kick({
                    reason: "Spamming",
                  });
                });
            });
            break;
        }
      }
      // Send and delete the warning message
      const msg = await message.channel.send({ embeds: [embed] });
      setTimeout(async () => {
        await msg.delete();
      }, 8500);

      // Create buttons for additional actions
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

      // Send a message to the log channel with buttons
      const text = await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `<@${message.author.id}> is spamming.\n\`\`\`${message.content}\`\`\``
            ),
        ],
        components: [buttons],
      });

      // Create a message component collector for the buttons
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
        switch (m.customId) {
          case "timeout":
            const embed = new EmbedBuilder()
              .setTitle("Timeout")
              .setDescription(
                `You have received a timeout from \`${message.guild.name}\` for spamming`
              )
              .setColor("Red");
            m.reply({
              content: `Timed out ${message.author.tag}`,
              ephemeral: true,
            });
            message.member.send({
              embeds: [embed],
            });
            const time = ms(requireDB.Timeout);
            message.member.timeout(time);
            break;
          case "kick":
            const embedss = new EmbedBuilder()
              .setTitle("Kicked")
              .setDescription(
                `You have been kicked from \`${message.guild.name}\` is spamming`
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
                message.member.kick({ reason: "Spamming" });
              });
            break;
        }
      });
    }
  },
};
