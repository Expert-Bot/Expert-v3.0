const {
  Events,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: Events.MessageCreate,

  async execute(message, client, interaction) {
    if (message.author.bot) return;
    if (message.content.includes("<@1180863896773468351"))  { //your bot id
       
       
      const pingEmbed = new EmbedBuilder()
      
        .setColor("DarkerGrey")
        .setTitle("🏓 • Who mentioned me??")
        .setDescription(
          `Hey there ${message.author.username}!, here is some useful information about me.\n⁉️ • **How to view all commands?**\nEither use **/help** or do / to view a list of all the commands!`
        )

        .addFields({ name: `**🏡 • Servers:**`, value: `${client.guilds.cache.size}`, inline: true })
        .addFields({ name: `**👥 • Users:**`, value: `${client.users.cache.size}`, inline: true})
        .addFields({ name: `**💣 • Commands:**`, value: `${client.commands.size}`, inline: true})
        .setTimestamp()
        //.setThumbnail(`https://images-ext-2.discordapp.net/external/kYZ9-W_VdGxOB7cRlOO-2-IH2fJrAVjLQhPczBBRDzk/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1023810715250860105/593d6d98f5169db7a0ba28464846ed29.png?width=656&height=656`) / any image you would like
        .setFooter({text: `Requested by ${message.author.username}.`})
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("➕")
          .setLabel("Invite")
          .setURL(
            "https://discord.com/api/oauth2/authorize?client_id=1023810715250860105&permissions=8&scope=applications.commands%20bot" //your bot invite link
          )
          .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
          .setEmoji("⚙️")
          .setLabel("Support")
          .setURL(
            "https://discord.gg/DYhTZdpznE" //your bot support server invite link
          )
          .setStyle(ButtonStyle.Link)
          // Wondering how to add a new button?
          // Check out the docs at https://discord.js.org/#/docs/main/stable/class/MessageEmbed?scrollTo=addFields
          // Also this is way ezier
          // Simply uncomment the lines below and replace the emojis with your own emojis and labels with your own labels.
          /* .setStyle(ButtonStyle.Link), can be link, primary, secondary, success, danger, warning, info, or grey
          new ButtonBuilder()
          .setEmoji("⚙️") Can be any emoji you want. To add custom server emojis, you must use the emoji id.
          .setLabel("Support") Name of the button
          .setURL(
            "https://discord.gg/DYhTZdpznE") // Put your link here if you are using a link. If you arnt using a link, just delete this line.
          .setStyle(ButtonStyle.Link) */ // Can be link, primary, secondary, success, danger, warning, info, or grey
      );

      return message.reply({ embeds: [pingEmbed], components: [buttons] });
    }
  },
};
