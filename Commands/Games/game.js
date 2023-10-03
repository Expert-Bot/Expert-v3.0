const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const {
  Connect4,
  FastType,
  FindEmoji,
  Flood,
  Hangman,
  MatchPairs,
  Wordle,
  Minesweeper,
  RockPaperScissors,
  Slots,
  Snake,
  TicTacToe,
} = require("discord-gamecord");
const set = require("../../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("games")
    .setDescription("Play various games")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("connect-four")
        .setDescription("Play a game of Connect Four!")
        .addUserOption((option) =>
          option
            .setName("opponent")
            .setDescription("Specified user will be your opponent.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("fast-type")
        .setDescription("Play a game of Fast Type!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("find-emoji")
        .setDescription("Play a game of Find Emoji!")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("flood").setDescription("Play a game of Flood!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("gunfight")
        .setDescription("Play a game of Cowboy!")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("Select a player to challenge")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("hangman").setDescription("Play a game of Hangman!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("match-pairs")
        .setDescription("Play a game of Match Pairs!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("minesweeper")
        .setDescription("Play a game of Minesweeper!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rps")
        .setDescription("Play a game of Rock Paper Scissors!")
        .addUserOption((option) =>
          option
            .setName("opponent")
            .setDescription("Specified user will be your opponent.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("slots").setDescription("Play a game of Slots!")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("snake").setDescription("Play a game of Snake!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ttt")
        .setDescription("Play a game of Tic Tac Toe!")
        .addUserOption((option) =>
          option
            .setName("opponent")
            .setDescription("Specified user will be your opponent.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("wordle").setDescription("Play a game of Wordle!")
    ),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    if (interaction.options.getSubcommand() === "connect-four") {
      const enemy = interaction.options.getUser("opponent");
      if (interaction.user.id === enemy.id)
        return await interaction.reply({
          content: `You **cannot** play with yourself, silly goose...`,
          ephemeral: true,
        });
      if (enemy.bot)
        return await interaction.reply({
          content: `You **cannot** play with a bot, silly goose...`,
          ephemeral: true,
        });

      const game = new Connect4({
        message: interaction,
        isSlashGame: true,
        opponent: interaction.options.getUser("opponent"),
        embed: {
          title: "> Connect Four Game",
          rejectTitle: "Cancelled Request",
          statusTitle: "• Status",
          overTitle: "• Game Over",
          color: set.cyberColor,
          rejectColor: "Red",
        },
        emojis: {
          board: "⚪",
          player1: "🔴",
          player2: "🔵",
        },
        mentionUser: true,
        timeoutTime: 120000,
        buttonStyle: "PRIMARY",
        turnMessage: "> {emoji} | **{player}**, it is your turn!.",
        winMessage: "> 🎉 | **{player}** has won the Connect Four Game!",
        tieMessage: "> The game turned out to be a tie!",
        timeoutMessage: "> The game went unfinished! no one won the game!",
        playerOnlyMessage:
          "Only {player} and {opponent} can use these buttons.",
        rejectMessage:
          "{opponent} denied your request for a round of Connect Four!",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "fast-type") {
      const game = new FastType({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "> Fast Type",
          color: set.cyberColor,
          description: "You have {time} seconds to type the sentence below.",
        },
        timeoutTime: 60000,
        sentence: "A really cool sentence to fast type.",
        winMessage:
          "> 🎉 | You won! You finished the type race in {time} seconds with {wpm} wpm.",
        loseMessage: `> You lost, you couldn't type the correct sentence in time.`,
        timeoutMessage: "> The game went unfinished.",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "find-emoji") {
      const game = new FindEmoji({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "> Find Emoji",
          color: set.cyberColor,
          description: "Remember the emojis from the board below.",
          findDescription: "Find the {emoji} emoji before the time runs out.",
        },
        timeoutTime: 60000,
        hideEmojiTime: 5000,
        buttonStyle: "PRIMARY",
        emojis: ["🍉", "🍇", "🍊", "🍋", "🥭", "🍎", "🍏", "🥝"],
        winMessage: "> 🎉 | You won! You selected the correct emoji. {emoji}",
        loseMessage: "> You lost! You selected the wrong emoji. {emoji}",
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "flood") {
      const game = new Flood({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "> Flood",
          color: set.cyberColor,
        },
        difficulty: 8,
        timeoutTime: 60000,
        buttonStyle: "PRIMARY",
        emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
        winMessage: "> 🎉 | You won! You took **{turns}** turns.",
        loseMessage: "> You lost! You took **{turns}** turns.",
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "gunfight") {
      const player = interaction.options.getUser("player");
      if (player.id === interaction.user.id) {
        return interaction.reply({
          content: "You cannot challenge yourself!",
          ephemeral: true,
        });
      }

      const acceptButton = new ButtonBuilder()
        .setCustomId("accept")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success);

      const declineButton = new ButtonBuilder()
        .setCustomId("decline")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(
        acceptButton,
        declineButton
      );

      await interaction.reply({
        content: `${player}, you have been challenged to a cowboy game by ${interaction.user}! Do you want to accept this challenge?`,
        components: [row],
      });

      const filter = (i) => i.user.id === player.id;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "accept") {
          collector.stop("accept");
          const words = ["shoot", "draw", "aim", "reload", "fire", "bullets"];
          const word = words[Math.floor(Math.random() * words.length)];
          const delay = Math.floor(Math.random() * 5000) + 3000;

          const readyEmbed = new EmbedBuilder()
            .setTitle("Get Ready!")
            .setDescription("The game will start at any moment.")
            .setImage("https://giffiles.alphacoders.com/102/102565.gif")
            .setColor(set.cyberColor);

          await interaction.followUp({ embeds: [readyEmbed] });

          await new Promise((resolve) => setTimeout(resolve, delay));

          await interaction.followUp(`The word is **${word}**! TYPE NOW!`);

          const winnerFilter = (m) =>
            m.content.toLowerCase() === word.toLowerCase();
          const winner = await interaction.channel.awaitMessages({
            filter: winnerFilter,
            max: 1,
            time: 60000,
          });

          if (!winner.size) {
            await interaction.followUp(
              `No one typed the word in time. It's a tie!`
            );
          } else {
            const winnerUser = winner.first().author;
            const winnerEmbed = new EmbedBuilder()
              .setTitle("Congratulations!")
              .setImage(
                "https://media.tenor.com/oDedOU2hfZcAAAAC/anime-cowboybebop.gif"
              )
              .setDescription(
                `${winnerUser} won the cowboy game against ${
                  interaction.user.id === winnerUser.id
                    ? player
                    : interaction.user
                }!`
              )
              .setColor(set.cyberColor);
            await interaction.followUp({ embeds: [winnerEmbed] });
          }
        } else if (i.customId === "decline") {
          collector.stop("decline");
          await interaction.followUp(
            `${player} declined the challenge. Maybe next time!`
          );
        }
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          await interaction.followUp({
            content: `${player} did not respond in time. Maybe next time!`,

            components: [],
          });
        }
      });
    } else if (interaction.options.getSubcommand() === "hangman") {
      const game = new Hangman({
        message: interaction,
        embed: {
          title: `> Hangman`,
          color: set.cyberColor,
        },
        hangman: {
          hat: "🎩",
          head: `👨‍🦰`,
          shirt: `👕`,
          pants: `🩳`,
          boots: `🥾🥾`,
        },
        timeoutTime: 60000,
        timeWords: "all",
        winMessage: `> 🎉 | You won! The word was **{word}**`,
        loseMessage: `> You lost, the word was **{word}**`,
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage: `Only {player} can use these buttons`,
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "match-pairs") {
      const game = new MatchPairs({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "> Match Pairs",
          color: set.cyberColor,
          description:
            "**Click on the buttons to match emojis with their pairs.**",
        },
        timeoutTime: 60000,
        emojis: [
          "🍉",
          "🍇",
          "🍊",
          "🥭",
          "🍎",
          "🍏",
          "🥝",
          "🥥",
          "🍓",
          "🫐",
          "🍍",
          "🥕",
          "🥔",
        ],
        winMessage:
          "> 🎉 | **You won the Game! You turned a total of `{tilesTurned}` tiles.**",
        loseMessage:
          "> **You lost the Game! You turned a total of `{tilesTurned}` tiles.**",
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "minesweeper") {
      const game = new Minesweeper({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "> Minesweeper",
          color: "#2f3136",
          description:
            "Click on the buttons to reveal the blocks except mines.",
        },
        emojis: { flag: "🚩", mine: "💣" },
        mines: 5,
        timeoutTime: 60000,
        winMessage:
          "> 🎉 | You have won the game! All mines were successfully avoided by you. ",
        loseMessage:
          "> You failed the game. Next time, be cautious of the mines.",
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "rps") {
      const enemy = interaction.options.getUser("opponent");
      if (interaction.user.id === enemy.id)
        return await interaction.reply({
          content: `You **cannot** play with yourself, silly goose...`,
          ephemeral: true,
        });
      if (enemy.bot)
        return await interaction.reply({
          content: `You **cannot** play with a bot, silly goose...`,
          ephemeral: true,
        });

      const game = new RockPaperScissors({
        message: interaction,
        isSlashGame: true,
        opponent: interaction.options.getUser("opponent"),
        embed: {
          title: "Rock Paper Scissors",
          rejectTitle: "Cancelled Request",
          statusTitle: "• Status",
          overTitle: "• Game Over",
          color: set.cyberColor,
          rejectColor: "Red",
        },
        buttons: {
          rock: "Rock",
          paper: "Paper",
          scissors: "Scissors",
        },
        emojis: {
          rock: "🌑",
          paper: "📰",
          scissors: "✂️",
        },
        mentionUser: true,
        timeoutTime: 120000,
        buttonStyle: "PRIMARY",
        pickMessage: "> You chose {emoji}.",
        winMessage: "> 🎉 | **{player}** has won the Rock-Paper-Scissors Game!",
        tieMessage: "> The game turned out to be a tie!",
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage:
          "Only {player} and {opponent} can use these buttons!",
        rejectMessage:
          "{opponent} denied your request for a round of Tic Tac Toe!",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "slots") {
      const game = new Slots({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "> Slot Machine",
          color: set.cyberColor,
        },
        slots: ["🍇", "🍊", "🍋", "🍌"],
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "snake") {
      const game = new Snake({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "> Snake Game",
          overTitle: "Game Over",
          color: set.cyberColor,
        },
        emojis: {
          board: "⬛",
          food: "🍎",
          up: "⬆️",
          down: "⬇️",
          left: "⬅️",
          right: "➡️",
        },
        snake: { head: "🟢", body: "🟩", tail: "🟢", over: "💀" },
        foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
        stopButton: "Stop",
        timeoutTime: 60000,
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "ttt") {
      const enemy = interaction.options.getUser("opponent");
      if (interaction.user.id === enemy.id)
        return await interaction.reply({
          content: `You **cannot** play with yourself, silly goose...`,
          ephemeral: true,
        });
      if (enemy.bot)
        return await interaction.reply({
          content: `You **cannot** play with a bot, silly goose...`,
          ephemeral: true,
        });

      const game = new TicTacToe({
        message: interaction,
        isSlashGame: true,
        opponent: interaction.options.getUser("opponent"),
        embed: {
          title: "> Tic Tac Toe",
          rejectTitle: "Cancelled Request",
          color: set.cyberColor,
          statusTitle: "• Status",
          overTitle: "• Game Over",
          rejectColor: "Red",
        },
        emojis: {
          xButton: "❌",
          oButton: "🔵",
          blankButton: "➖",
        },
        mentionUser: true,
        timeoutTime: 120000,
        xButtonStyle: "DANGER",
        oButtonStyle: "PRIMARY",
        turnMessage: "> {emoji} | **{player}**, it is your turn!.",
        winMessage: "> 🎉 | **{player}** has won the Tic Tac Toe Game!",
        tieMessage: "> The game turned out to be a tie!",
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage:
          "Only {player} and {opponent} can use these buttons.",
        rejectMessage:
          "{opponent} denied your request for a round of Tic Tac Toe!",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    } else if (interaction.options.getSubcommand() === "wordle") {
      const game = new Wordle({
        message: interaction,
        isSlashGame: false,
        embed: {
          title: `> Wordle`,
          color: set.cyberColor,
        },
        customWord: null,
        timeoutTime: 60000,
        winMessage: "> 🎉 | You won! The word was **{word}**",
        loseMessage: "> You lost! The word was **{word}**",
        timeoutMessage: "> The game went unfinished.",
        playerOnlyMessage: "Only {player} can use these buttons",
      });

      try {
        await game.startGame();
      } catch (err) {
        console.log(err);
        await interaction.reply("There was an error starting the game!");
      }
    }
  },
};
