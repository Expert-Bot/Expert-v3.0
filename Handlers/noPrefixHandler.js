const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const commandPath = path.join(__dirname, 'noprefixcommand');

  // Read all files in the command directory
  fs.readdir(commandPath, (err, files) => {
    if (err) {
      console.error('Error reading noprefix command files:', err);
      return;
    }

    // Filter out non-JS files
    const commandFiles = files.filter((file) => file.endsWith('.js'));

    // Load each command file
    for (const file of commandFiles) {
      const command = require(path.join(commandPath, file));

      // Set the command name as a property on the client object
      client[file.split('.')[0]] = command;
    }

    console.log(`Loaded ${commandFiles.length} no prefix command(s).`);
  });

  // Listen for message events
  client.on('messageCreate', (message) => {
    // Check if the message author is a bot
    if (message.author.bot) return;

    // Split the message content into command and arguments
    const [commandName, ...args] = message.content.trim().split(/\s+/);

    // Check if the command exists
    if (client[commandName]) {
      // Execute the command
      try {
        client[commandName].execute(client, message, args);
      } catch (error) {
        console.error('Error executing no prefix command:', error);
        message.reply('An error occurred while executing the command.');
      }
    }
  });
};
