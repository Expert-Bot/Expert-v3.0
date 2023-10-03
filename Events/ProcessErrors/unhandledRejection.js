module.exports = {
  process: true,
  name: "unhandledRejection",
  async execute(err, p, Embed, Channel, codeBlock, inspect, client) {
    require("colors");
    console.error("[Unhandled promise rejection]".red, err, p);

    Channel.send({
      embeds: [
        Embed.setDescription(
          "**Unhandled Rejection/Catch:\n\n** ```" + err + "```\n",
          codeBlock("js", inspect(err))
        ),
      ],
    });
  },
};
