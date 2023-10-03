module.exports = {
  client: true,
  name: "error",
  async execute(err, Embed, Channel, codeBlock, client) {
    require("colors");
    console.log("[Discord API Error]".red, err);

    Channel.send({
      embeds: [
        Embed.setDescription(
          "**Discord API Error/Catch:\n\n** ```" + err + "```"
        ),
      ],
    });
  },
};
