const {
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
    embedMsg,
    guild,
    name,
} = require("discord.js");
module.exports = {
  premiumOnly: false,
  voteRequired: false,
  data: new SlashCommandBuilder()
    .setName("help")

    .setDescription("Get a list of all the commands from the discord bot."),
  async execute(interaction) {

    const { client } = interaction;

       const voteButton = new ButtonBuilder()
      .setLabel("Vote")
      .setStyle(ButtonStyle.Link)
      .setURL("https://top.gg/bot/1023810715250860105/vote"); // Replace "your-bot-id" with your actual bot ID

    const supportButton = new ButtonBuilder()
      .setLabel("Support")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/dj44zMsnNX"); // Replace "your-support-server" with your actual support server invite link

  const devbutton = new ButtonBuilder()
	.setLabel("Developer")
	.setStyle(ButtonStyle.Link)
	.setURL("https://discord.com/users/903237169722834954");
      
    const emojis = {
      ai: "<:4928applicationbot:1117884195969179778>",
      suggestions: "<:2260rules:1117884137244721244>",
      reactionroles: "<:Astroz_botping:1113379074325360730>",
      premium: "<:8259owner:1117884027291045948>",
      info: "<:9847public:1117884065257885756>",
      developer: "<:9961developer:1117884072644055160>",
      economy: "<:icons_coin:1106291136462590022>",
      applications: "<:2141file:1117884126767353968>",
      botshop: "<:9791event:1117884062938435645>",
      fun: "<:3600iconjoin:1117884175320612934>",
      giveaways: "<:S_Giveaway:1118852096201080872>",
      moderation: "<:1072automod:1117884077387825294>",
      music: "<:icon_music:1106291126006190120>",
      roles: "<:9791event:1117884062938435645>",
      services: "<:9847public:1117884065257885756>",
      suggest: "<:icons_rightarrow:1106298958956994642>",
      ticket: "<:bot_ticket_tool:1118850258408050759>",
      videos: "<:2004preview:1117884118781403266>",
      setup: "<:4302moderatororange:1117884185135284386>",
      games: "<:icons_games:1118850392101486642>",
      AntiNuke: "<:9426raidreport:1117884045385269469>",
    };

    function getCommand(name) {
      const getCommandID = client.application.commands.cache
        .filter((cmd) => cmd.name === name) // Filter by command name
        .map((cmd) => cmd.id); // Map to just the ID property

      return getCommandID;
    }

    const directories = [
      ...new Set(client.commands.map((cmd) => cmd.folder)),
    ];

    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const categories = directories.map((dir) => {
      const getCommands = client.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description:
             cmd.data.description ||
              " There is no description for this command.",
          };
        });
      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });
    const embed = new EmbedBuilder()
    .setTitle(" Multifunctional Discord bot")
      .setDescription("  Bot is works only with Slash Commands <:icon_slash:1106284500826193930> ```ini\n[See lists of commands by selecting a category down below!]```")
   	  .addFields({ name: ' ➜ If you need any help just Contact developer support', value: `Report this with \`/report bug\`` })
    .addFields({ name: '  ➜ Make sure Expert has the highest role, its required to secure your server at the highest quality.', value: `You can now play games on Expert bot. Use \`/games-multiplayer\` to explore this new feature now! ` })
      .setColor("#148be5")
      .setImage(`https://media.discordapp.net/attachments/1101154387201622189/1135514085845389312/Screenshot_2023-07-31_030714.png?width=960&height=265`)
      .setAuthor({ name: `${client.user.username}'s Commands`, iconURL: client.user.avatarURL() })
    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")

          .setPlaceholder("Find a category")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands from ${cmd.directory} category.`,
                emoji: emojis[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
        new ActionRowBuilder().addComponents(voteButton, supportButton, devbutton),
    ];
    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
    });

    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`${emojis[directory.toLowerCase() || null]}  ${formatString(directory)} commands`)
        .setImage(`https://media.discordapp.net/attachments/1101154387201622189/1135514085845389312/Screenshot_2023-07-31_030714.png?width=960&height=265`)
        .setDescription(
          `A list of all the commands categorized under ${directory}.`
        )
        .setColor("#148be5")
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `</${cmd.name}:${getCommand(cmd.name)}>`,
              value: `\`${cmd.description}\``,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  },
};