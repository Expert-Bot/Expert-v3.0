const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const automod = require("../../Schemas/automod");
const AntiSwear = require("../../Utils/Systems/BadWord.json");

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
    if (!requireDB) return;
    if (requireDB.AntiSwear == false) return;

    // Create a warning embed
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(
        `:warning: | <@${message.author.id}> has been warned for bad word usage.`
      );

    // Create regular expressions for known swear words and links
    const Swearlinks = AntiSwear.known_links.map(
      (word) =>
        new RegExp(
          `\\b${word.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1")}{2,}\\b`,
          "i"
        )
    );

    // Iterate through the regex patterns
    for (const regex of Swearlinks) {
      if (regex.test(message.content)) {
        try {
          await message.delete();
        } catch (err) {
          return;
        }

        const logChannel = client.channels.cache.get(requireDB.LogChannel);

        // Create buttons for additional actions
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Timeout")
            .setEmoji("⚒️")
            .setCustomId("timeout")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("Kick")
            .setEmoji("🔨")
            .setCustomId("kick")
            .setStyle(ButtonStyle.Danger)
        );

        if (timeDifference < 3500) {
          // If the user has sent a message recently, return early
          return;
        }

        // Send a warning message
        const msg = await message.channel.send({ embeds: [embed] });
        setTimeout(async () => {
          await msg.delete();
        }, 8500);

        // Send a log message with buttons
        const text = await logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `<@${message.author.id}> has been warned for bad word usage.\n\`\`\`${message.content}\`\`\``
              ),
          ],
          components: [buttons],
        });

        // Create a message component collector for the buttons
        const col = text.createMessageComponentCollector();
        col.on("collect", async (m) => {
          const ms = require("ms");
          switch (m.customId) {
            case "timeout":
              if (
                !m.member.permissions.has(PermissionFlagsBits.ModerateMembers)
              )
                return m.reply({
                  content: "You don't have permission to timeout",
                  ephemeral: true,
                });

              // Create a timeout embed
              const embed = new EmbedBuilder()
                .setTitle("Timeout")
                .setDescription(
                  `You have received a timeout from \`${message.guild.name}\` for sending scam links`
                )
                .setColor("Red");

              if (!message.member) {
                return m.reply({
                  content: "This user doesn't exist",
                  ephemeral: true,
                });
              }
              m.reply({
                content: `Timeout ${message.author.tag}`,
                ephemeral: true,
              });

              // Send a timeout embed to the user and apply the timeout
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
              if (!m.member.permissions.has(PermissionFlagsBits.KickMembers))
                return m.reply({
                  content: "You don't have permission to kick",
                  ephemeral: true,
                });

              // Create a kicked embed
              const embedss = new EmbedBuilder()
                .setTitle("Kicked")
                .setDescription(
                  `You have been kicked from \`${message.guild.name}\` for sending scam links`
                )
                .setColor("Red");
              m.reply({
                content: `Kicked ${message.author.tag}`,
                ephemeral: true,
              });

              // Send a kicked embed to the user and kick them
              message.member
                .send({
                  embeds: [embedss],
                })
                .then(() => {
                  message.member.kick({ reason: "Sending scam links" });
                });
              break;
          }
        });
      }
    }
  },
};
