const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
  } = require("discord.js");
  const mal = require("mal-scraper");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("anime")
      .setDescription("💮 Search for information about Anime by given name")
      .addStringOption((option) =>
        option.setName("query").setDescription("Anime name").setRequired(true)
      ),
    /**
     * @param { ChatInputCommandInteraction } interaction
     */
    async execute(interaction) {
      const search = interaction.options.getString("query");
      await interaction.deferReply();
      mal.getInfoFromName(search).then((data) => {
        const embed = new EmbedBuilder()
          .setAuthor({ name: `My Anime List search result for ${search}` })
          .setImage(data.picture)
          .setColor("#5865F2")
          .addFields(
            { name: "English Title", value: `${data.englishTitle || "None!"}` },
            { name: "Japanese Title", value: `${data.japaneseTitle || "None!"}` },
            { name: "Type", value: `${data.type || "N/A!"}` },
            { name: "Episodes", value: `${data.episodes || "N/A!"}` },
            { name: "Score", value: `${data.score || "N/A!"}` },
            { name: "Rating", value: `${data.rating || "N/A!"}` },
            { name: "Aired", value: `${data.aired || "N/A!"}` },
            { name: "Scored by", value: `${data.scoreStats || "N/A!"}` }
          )
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 2048,
            }),
          })
          .setTimestamp();
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(data.url)
            .setLabel("View more")
        );
        interaction.followUp({ embeds: [embed], components: [row] });
      });
    },
  };
  