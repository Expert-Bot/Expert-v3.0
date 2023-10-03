async function LoadErrorHandler(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  const { EmbedBuilder, codeBlock } = require("discord.js");
  const { inspect } = require("util");
  require("colors");

  await client.errors.clear();

  const Files = await loadFiles("Error_Events");
  if (!Files) {
    throw new Error("[FOLDER_NOT_FOUND]".red + " Error_Events was not found");
  }
  console.log("Go ahead")
  Files.forEach(async (files) => {
    const error = require(files);
    const ChannelID = "1091125319081148498"
    const Channel = await client.channels.fetch(ChannelID);
    if (!Channel) return;

    const Embed = new EmbedBuilder()
      .setColor("Random")
      .setTimestamp()
      .setFooter({ text: "⚠️Anti Crash system" })
      .setTitle("Error/Warn Encountered");
    const execute = (err, p) =>
      error.execute(err, p, Embed, Channel, codeBlock, inspect, client, client);
    client.errors.set(error.name, execute);

    if (error.client) {
      client.on(error.name, execute);
    } else if (error.process) {
      process.on(error.name, execute);
    } else {
      return console.log("Not a valid error type");
    }
    console.log("ErrorHandler" + " · Loaded" + " " + error.name);
  });
}
module.exports = { LoadErrorHandler };