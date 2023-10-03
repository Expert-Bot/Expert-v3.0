const { model, Schema } = require('mongoose')

let commandListSchema = new Schema({
    User: String,

    //economy
    balance: Number,
    beg: Number,
    daily: Number,
    monthly: Number,
    weekly: Number,

    //fun
    eightball: Number, //8ball
    funnyNum: Number, //69420
    ascii: Number,
    emojify: Number,
    howgay: Number,
    kill: Number,
    meme: Number,
    nitro: Number,
    pp: Number,
    say: Number,
    spoof: Number,

    //games
    twofour: Number, //2048
    connectfour: Number,
    hangman: Number,
    minesweeper: Number,
    rps: Number,
    snake: Number,
    ttt: Number,
    wordle: Number,

    //images
    avatar: Number,
    cat: Number,
    dog: Number,
    pixelate: Number,

    //info
    botinfo: Number,
    serverinfo: Number,
    userinfo: Number,

    //nsfw
    fourk: Number, //4k
    anal: Number,
    ass: Number,
    gonewild: Number,
    hentai: Number,
    hentaiass: Number,
    porngif: Number,
    pussy: Number,
    thigh: Number,

    //owner
    topguild: Number,

    //tools
    chatgpt: Number,
    dictionary: Number,
    enlarge: Number,
    free: Number,
    help: Number,
    math: Number,
    music: Number,
}, { versionKey: false })

module.exports = model("commandList", commandListSchema)