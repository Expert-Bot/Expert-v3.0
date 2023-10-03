const { Client } = require("discord.js");
module.exports = {
  name: "messageCreate",
  /**
 * 

 * @param {Client} client 
 */
  async execute(message, client) {
    const Prefix = "?";
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.content.toLowerCase().startsWith(Prefix)) {
      const args = message.content.slice(Prefix.length).trim().split(/ +/g);
      const commandName = args.shift();
      const command = client.commands.get(commandName);
      if (!command) return;
      try {
        command.run(client, message, args);
      } catch {
        return;
      }
    }
  },
};
