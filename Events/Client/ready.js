const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const config = require("../../config.json");
require("colors");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await mongoose.connect(config.mongodb || '', {
      keepAlive: true,
    });

    if (mongoose.connect) {
      console.log('[+]'.green + ' MongoDB connection successful.');
    }
    
    const totalMembers = client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0);
    const totalServers = client.guilds.cache.size;
    const totalChannels = client.channels.cache.size;
    const shardCount = client.shard ? client.shard.count : 1;
    
    const activities = [
      `in ${totalServers} server${totalServers > 1 ? 's' : ''}`,
      `in ${totalChannels} channel${totalChannels > 1 ? 's' : ''}`,
      `/help & help`,
      `on ${shardCount} shard${shardCount > 1 ? 's' : ''}`
    ];
    
    let i = 0;

    setInterval(() => {
      client.user.setPresence({ activities: [{ name: activities[i++ % activities.length], type: ActivityType.Watching }] });
    }, 15000);
    
     console.log(`[ONLINE]`.green + ` ${client.user.tag} is online in ${totalServers} server(s) with ${totalMembers} members and ${totalChannels} channels!`);
  },
};