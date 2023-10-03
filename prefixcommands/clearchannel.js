const { PermissionsBitField } = require("discord.js");
module.exports = {
  nombre: 'clearchannel',
  category: 'Moderation',
  description: 'Clear all messages in the channel',
  usage: ['<prefix>clearchannel'],
  run: async (client, message, args) => {
    // Check if the user has permission to use the command
    if (!message.member.permissions.has(PermissionsBitField.Flags.MANAGE_MESSAGES)) {
      return message.reply("You do not have permission to use this command.");
    }

    // Defer the reply to reduce API overhead
    const reply = await message.reply("Clearing channel...");

    // Get the channel and initialize a counter for deleted messages
    const channel = message.channel;
    let deletedSize = 0;

    // Loop through messages and delete them in batches of 100
    while (true) {
      const fetchedMessages = await channel.messages.fetch({ limit: 100 });
      if (fetchedMessages.size === 0) break;

      const deletedMessages = await channel.bulkDelete(fetchedMessages, true);
      if (deletedMessages.size === 0) break;

      deletedSize += deletedMessages.size;
    }

    // Edit the initial reply to show the number of deleted messages
    reply.edit(`Successfully deleted **${deletedSize}** messages in this channel.`);
  },
};

