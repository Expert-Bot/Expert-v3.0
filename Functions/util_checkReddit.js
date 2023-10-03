const { subreddits, lookuptime, limit, Embed, colors, blacklistedURLs, blacklistedUsers, dublicateCheck, dublicateCheckCrossSubreddits } = require("../config.json");
const { EmbedBuilder } = require("discord.js");
const { ChannelType } = require("discord-api-types/v10");
const { decode } = require("html-entities");

async function getSubredditData() {
  // Health Check
  let response = await fetch("https://www.reddit.com/");
  if (response.status !== 200) {
    console.log(`[REDDIT] Reddit is currently down, trying again in ${lookuptime} minutes`);
  }
  // Get all new Posts from Subreddits
  let allPosts = [];
  for (let subreddit of subreddits) {
    let response = await fetch(
      `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`
    );
    let json = await response.json();
    // Get the latest Post from DB and compare it to the latest Post from Reddit
    let feedUpdate = await client.db.get(`${subreddit}.feedUpdate`);
    let posts = json.data.children.filter(
      (post) => (post.data.created_utc * 1000) > feedUpdate
    );
    // Set feedUpdate to current time
    await client.db.set(`${subreddit}.feedUpdate`, Date.now());
    if (posts.length === 0) {
      continue;
    }
    allPosts.push(...posts);
  }
  return allPosts;
}

async function getSubredditComments(subreddit, postDataId) {
  let response = await fetch(
    `https://www.reddit.com/r/${subreddit}/comments/${postDataId}/best.json?limit=50`
  );
  // Filter response for author FGF_Info_Bot
  let json = await response.json();
  let comments = json[1].data.children.filter(
    (comment) => comment.data.author === "FGF_Info_Bot"
  );
  return postDataBotComment;
}

async function getRedditUser(user) {
  let response = await fetch(
    `https://www.reddit.com/user/${user}/about.json`
  );
  let json = await response.json();
  let profilePicture = json.data.subreddit.icon_img;
  profilePicture = profilePicture.split("?")[0];
  return profilePicture;
}

async function getPostsData(allPosts) {
  let postInfos = []
  for (let post of allPosts) {
    let postDataTitel = decode(post.data.title);
    let postDataAuthor = post.data.author;
    let postDataDescription = post.data.selftext;

    console.log(`[REDDIT] Found ${postDataTitel} at ${new Date().toLocaleString()}`);
    // Limit Description to 2048 Characters (Discord Limit)
    if (postDataDescription.length > 2048) {
      postDataDescription = postDataDescription.substring(0, 2045) + "...";
    }
    // If no Description is available, set it
    if (postDataDescription == "") {
      postDataDescription = "No Description available";
    }
    postDataDescription = decode(postDataDescription);
    // Get and check Thumbnail
    let postDataThumbnail = post.data.thumbnail;
    if (postDataThumbnail == "default" || postDataThumbnail == "self" || postDataThumbnail == "nsfw") {
      postDataThumbnail = Embed.Thumbnail_Default;
    }
    let postDataAuthorFull = post.data.author_fullname;
    let postDataAuthorImage = await getRedditUser(postDataAuthor);
    let postDataUpvotes = post.data.upvote_ratio;
    let postDataCommentCount = post.data.num_comments;
    let postDataScore = post.data.score;
    let postDataUrl = post.data.url;
    let postDataUrlPost = `https://www.reddit.com${post.data.permalink}`;
    let postDataCreationTime = Math.floor(post.data.created_utc);
    // Check if postDataUrl is included in blacklistedURLs
    let blacklisted = false;
    for (let url of blacklistedURLs) {
      if (postDataUrl.toLowerCase().includes(url)) {
        blacklisted = true;
        break;
      }
    }
    // Check if postDataAuthor is a  blacklistedUsers
    for (let buser of blacklistedUsers) {
      if (postDataAuthor.toLowerCase() == (buser)) {
        blacklisted = true;
        break;
      }
    }
    if (blacklisted) {
      continue;
    }
    // Check if Post is a duplicate
    if (dublicateCheck == true && dublicateCheckCrossSubreddits == false) {
      let latestPosts = await client.db.get(`${post.data.subreddit}.latestPosts`);
      if (latestPosts != null) {
        for (let i = latestPosts.length; i >= 0; i--) {
          if (latestPosts[i] == postDataTitel.toLowerCase()) {
            console.log(`[REDDIT] Found ${postDataTitel} at ${new Date().toLocaleString()}, however it is a duplicate. Skipping...`);
            continue;
          }
        }
      }
    }
    if (dublicateCheck == true && dublicateCheckCrossSubreddits == true) {
      let latestPosts = await client.db.get(`latestPosts`);
      if (latestPosts != null) {
        for (let i = latestPosts.length; i >= 0; i--) {
          if (latestPosts[i] == postDataTitel.toLowerCase()) {
            console.log(`[REDDIT] Found ${postDataTitel} at ${new Date().toLocaleString()}, however it is a duplicate. Skipping...`);
            continue;
          }
        }
      }
    }
    // Put the latest Post Titles into the subreddit DB
    await client.db.push(`${post.data.subreddit}.latestPosts`, postDataTitel.toLowerCase());
    latestPosts = await client.db.get(`${post.data.subreddit}.latestPosts`);
    if (latestPosts.length > 12) {
      // Remove the oldest Post Title from the subreddit DB
      await client.db.pull(`${post.data.subreddit}.latestPosts`, latestPosts[0]);
    }
    await client.db.push(`latestPosts`, postDataTitel.toLowerCase());
    latestPosts = await client.db.get(`latestPosts`);
    if (latestPosts.length > 12) {
      // Remove the oldest Post Title from the subreddit DB
      await client.db.pull(`latestPosts`, latestPosts[0]);
    }
    // Check for Launcher
    let postDataLauncher = post.data.title.match(/^\[([a-zA-Z0-9 \.]+)(?:[\/, ]*[a-zA-Z0-9\. ]*)*\]+.*$/mi);
    if (postDataLauncher != null && typeof postDataLauncher === 'object' && postDataLauncher.length > 1) {
      postDataLauncher = postDataLauncher[1]
    } else {
      postDataLauncher = "unknown"
    }
    /*let postDataBotComment = await getSubredditComments(subreddit, postDataId);
    if (postDataBotComment.length >= 1) {
        let postDataStorePage = postDataBotComment[0].data.body.match(/^.*\[Store Page\]\((.*)\).*$/gmi);
        let postDataSteamDB = postDataBotComment[0].data.body.match(/^.*\[SteamDB\]\((.*)\).*$/gmi);
        let postDataPrice = postDataBotComment[0].data.body.match(/^.*\[Price\]\((.*)\).*$/gmi);
    }*/
    postInfos.push({
      Title: postDataTitel,
      Author: postDataAuthor,
      Author_Image: postDataAuthorImage,
      Thumbnail: postDataThumbnail,
      Description: postDataDescription,
      Author_Full: postDataAuthorFull,
      Upvotes: postDataUpvotes,
      CommentCount: postDataCommentCount,
      Score: postDataScore,
      URL: postDataUrl,
      URL_Post: postDataUrlPost,
      CreationTime: postDataCreationTime,
      Launcher: postDataLauncher,
    });
  }
  return postInfos;
}

async function sendNotification(posts) {
  // Create a new Embed with Post Data
  let postInfos = await getPostsData(posts)
  for (let postInfo of postInfos) {
    let embedColor
    switch (postInfo.Launcher.toLowerCase()) {
      case "steam":
        embedColor = colors.Steam
        break;
      case "epic":
      case "epic games":
        embedColor = colors.Epic
        break;
      case "gog":
        embedColor = colors.GOG
        break;
      case "itch.io":
        embedColor = colors.Itch
        break;
      case "unknown":
        embedColor = colors.Other
      default:
        embedColor = colors.Expired
        platform = "Unknown"
        break;
    }
    let embed = new EmbedBuilder()
      .setTitle(`${postInfo.Title}`)
      .setDescription(`${postInfo.Description}`)
      .setFields(
        {
          name: "Date",
          value: `<t:${postInfo.CreationTime}:f>`,
          inline: true
        },
        {
          name: "Comments",
          value: `${postInfo.CommentCount}`,
          inline: true
        },
        {
          name: "Upvote Ratio",
          value: `${postInfo.Upvotes}`,
          inline: true
        },
        {
          name: "Score",
          value: `${postInfo.Score}`,
          inline: true
        },
        {
          name: "Free Game Link",
          value: `[Click me](${postInfo.URL})`,
          inline: false
        })
      .setThumbnail(postInfo.Thumbnail)
      .setURL(postInfo.URL_Post)
      .setColor(embedColor)
      .setAuthor({
        name: postInfo.Author,
        iconURL: postInfo.Author_Image,
        url: `https://www.reddit.com/user/${postInfo.Author}`
      })
      .setFooter({
        text: Embed.Footer,
        iconURL: Embed.Footer_Icon
      })
      .setTimestamp()

    // Send Embed to all Guilds
    for (let guild of client.guilds.cache.values()) {
      try {
        let feedRole = await client.db.get(`${guild.id}.feedRole`);
        let feedChannel = await client.db.get(`${guild.id}.feedChannel`);
        let feedChannelType = await client.db.get(`${guild.id}.feedChannelType`);
        if (feedChannel != null) {
          let channel = client.channels.cache.get(feedChannel);
          if (feedChannelType === ChannelType.GuildAnnouncement) {
            if (feedRole != null) {
              let message = await channel.send({
                content: `<@&${feedRole}>`,
                embeds: [embed],
              })
              message.crosspost();
            } else {
              let message = await channel.send({ embeds: [embed] });
              message.crosspost();
            }
          } else {
            if (feedRole != null) {
              channel.send({
                content: `<@&${feedRole}>`,
                embeds: [embed],
              });
            } else {
              channel.send({ embeds: [embed] });
            }
          }
        } else {
          continue;
        }
      } catch (e) {
        // Oops, I don't care
      }
    }
  }
}

async function checkReddit() {
  if (client == null)
    return;
  // Get Subreddit Data
  let posts = await getSubredditData();
  // Send Notification
  await sendNotification(posts);
  return
}
let client = null;
function insertClient(client2) {
  client = client2;
}

// Create schedule for checking reddit
setInterval(checkReddit, lookuptime * 60000);

module.exports = { checkReddit, insertClient };