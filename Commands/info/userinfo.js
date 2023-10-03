const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const { profileImage } = require('discord-arts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("memberinfo")
    .setDescription("view your or any member informations")
    .setDMPermission(false)
    .addUserOption((option) => option
      .setName("member")
      .setDescription("View member informations")
    ),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();
    const memberOption = interaction.options.getMember("member");
    const member = memberOption || interaction.member;

    if (member.user.bot) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription("At this moment, the bot isn't supported for the bots.")
        ],
        ephemeral: true
      });
    }

    try {
      const fetchedMembers = await interaction.guild.members.fetch();

      const profileBuffer = await profileImage(member.id);
      const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });

      const joinPosition = Array.from(fetchedMembers
        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
        .keys())
        .indexOf(member.id) + 1;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);

      const Booster = member.premiumSince ? "<:supporter:1111756403795841094>" : "✖";

      const avatarButton = new ButtonBuilder()
        .setLabel('Avatar')
        .setStyle(5)
        .setURL(member.displayAvatarURL());

      const bannerButton = new ButtonBuilder()
        .setLabel('Banner')
        .setStyle(5)
        .setURL((await member.user.fetch()).bannerURL() || 'https://example.com/default-banner.jpg');

      const row = new ActionRowBuilder()
        .addComponents(avatarButton, bannerButton);

      const Embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.tag} | General Information`, iconURL: member.displayAvatarURL() })
        .setColor('Aqua')
        .setDescription(`On <t:${joinTime}:D>, ${member.user.username} Joined as the **${addSuffix(joinPosition)}** member of this guild.`)
        .setImage("attachment://profile.png")
        .addFields([
          { name: "Badges", value: `${addBadges(userBadges).join("")}`, inline: true },
          { name: "Booster", value: `${Booster}`, inline: true },
          { name: "Top Roles", value: `${topRoles.join("").replace(`<@${interaction.guildId}>`)}`, inline: false },
          { name: "Created", value: `<t:${createdTime}:R>`, inline: true },
          { name: "Joined", value: `<t:${joinTime}:R>`, inline: true },
          { name: "UserId", value: `${member.id}`, inline: false },
        ]);

      interaction.editReply({ embeds: [Embed], components: [row], files: [imageAttachment] });

    } catch (error) {
      interaction.editReply({ content: "An error in the code" });
      throw error;
    }
  }
};

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13)
    return number + "th";

  switch (number % 10) {
    case 1: return number + "st";
    case 2: return number + "nd";
    case 3: return number + "rd";
  }
  return number + "th";
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["X"];
  const badgeMap = {
    "ActiveDeveloper": " <:activedeveloper:1138143449669980191> ",
    "BugHunterLevel1": " <:discordbughunter1:1138143477486604469>",
    "BugHunterLevel2": " <:discordbughunter2:1138143485380276415>",
    "PremiumEarlySupporter": " <:discordearlysupporter:1138143489931092049>",
    "Partner": " <:discordpartner:1138143517428949013>",
    "Staff": " <:discordstaff:1138143525540741291>",
    "HypeSquadOnlineHouse1": " <:hypesquadbravery:1138143416547545108>", // bravery
    "HypeSquadOnlineHouse2": " <:hypesquadbrilliance:1138143429436653651>", // brilliance
    "HypeSquadOnlineHouse3": " <:hypesquadbalance:1138143412089000039>", // balance
    "Hypesquad": " <:hypesquadevents:1138143433752580196>",
    "CertifiedModerator": " <:discordmod:1138143501431885914>",
    "VerifiedDeveloper": " <:discordbotdev:1138143465742532688>",
  };

  return badgeNames.map(badgeName => badgeMap[badgeName] || '❔');
}
