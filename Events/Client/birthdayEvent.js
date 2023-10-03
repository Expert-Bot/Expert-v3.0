const { EmbedBuilder } = require('discord.js');
const Birthday = require('../../Models/birthdayschema');

module.exports = async (client) => {
  setInterval(async () => {
    console.log('Checking for birthdays...');
    const today = new Date();
    const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));


    console.log('Start date:', start);
    console.log('End date:', end);

    const birthdays = await Birthday.find({
      $expr: {
        $and: [
          { $eq: [{ $month: '$birthday' }, start.getMonth() + 1] },
          { $eq: [{ $dayOfMonth: '$birthday' }, start.getDate()] },
        ],
      },
    });

    console.log(`Found ${birthdays.length} birthdays`);

    const channel = client.channels.cache.get('1091345968827486210'); // Replace CHANNEL_ID with the actual ID of the channel

    if (!channel) {
      console.error(`Error: could not find channel with ID ${channelId}`);
      return;
    }

    for (const bday of birthdays) {
      const user = await client.users.fetch(bday.userId);
      let birthdayimage = ["https://media.tenor.com/WIW4f9FjCuMAAAAC/birthday-eyelashes.gif"];

      const embed = new EmbedBuilder()
        .setTitle(`Happy Birthday, ${user.username}! 🎉🎂🎈`)
        .setImage(`${birthdayimage}`)
        .setDescription(`May your day be filled with joy and happiness!`)
        .setColor('#AD1457');

      try {
        await channel.send({ embeds: [embed] });
      } catch (err) {
        console.error(`Error sending birthday message to channel ${channelId}: ${err}`);
      }
    }
  }, 24 * 60 * 60 * 1000);
};
//credits to me! @Maryna4556