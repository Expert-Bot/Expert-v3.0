module.exports = {
  process: true,
  name: "uncaughtException",
  async execute(err, p, Embed, Channel, codeBlock, client) {
    require("colors");
    console.log("[Uncaught Exception]".red, err, p);

    Channel.send({
      embeds: [
        Embed.setDescription(
          "**Uncaught Exception/Catch:\n\n** ```" + err + "```"
        ),
      ],
    });
  },
};
