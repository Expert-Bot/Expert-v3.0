module.exports = {
  process: true,
  name: "warning",
  async execute(err, p, Embed, Channel, codeBlock, client) {
    require("colors");
    console.log("[Warning]".blue, err);

    Channel.send({
      embeds: [
        Embed.setDescription("**Warning/Catch:\n\n** ```" + err + "```"),
      ],
    });
  },
};
