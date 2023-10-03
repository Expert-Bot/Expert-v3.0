const { AttachmentBuilder } = require(`discord.js`);
const Canvas = require(`canvas`);
const welcomeSchema = require(`../../Models/welcomeSchema`);

module.exports = {
  name: "guildMemberAdd",

  async execute(member, client) {
    const data = await welcomeSchema.findOne({
      guildid: member.guild.id,
    });

    if (!data) return;

    var welcomeCanvas = {};
    welcomeCanvas.create = Canvas.createCanvas(1024, 500);
    welcomeCanvas.context = welcomeCanvas.create.getContext("2d");
    welcomeCanvas.context.font = "72px sans-serif";
    welcomeCanvas.context.fillStyle = "#ffffff";

    // important
    const imageURL = "https://i.pinimg.com/564x/55/88/75/5588753f3911dab4a0a4b71fc50fb8bd.jpg"; // Replace this with the actual URL of the image

    await Canvas.loadImage(imageURL).then(async (img) => {
      welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
      welcomeCanvas.context.fillText("Welcome", 360, 360);
      welcomeCanvas.context.beginPath();
      welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
      welcomeCanvas.context.stroke();
      welcomeCanvas.context.fill();
    });

    let canvas = welcomeCanvas;
    (canvas.context.font = "42px sans-serif"),
      (canvas.context.textAlign = "center");
    canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
    canvas.context.font = "32px sans-serif";
    canvas.context.fillText(
      `You are the ${member.guild.memberCount}th Member To Join The Server`,
      512,
      455
    );
    canvas.context.beginPath();
    canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();
    await Canvas.loadImage(
      member.user.displayAvatarURL({ extension: "jpg", size: 1024 })
    ).then((img) => {
      canvas.context.drawImage(img, 393, 47, 238, 238);
    });

    const attachment = new AttachmentBuilder(await canvas.create.toBuffer(), {
      name: "welcome.png",
    });

    process.noDeprecation = true;

    member.guild.channels.cache.get(data.channel).send({
      content: data.message
        .replace(/\{mention\}/g, member.user.toString())
        .replace(/\{user\}/g, member.user.username)
        .replace(/\{server\}/g, member.guild.name)
        .replace(/\{members\}/g, member.guild.memberCount),
      files: [attachment],
    });
  },
};
