const { EmbedBuilder } = require("discord.js");

function handleLogs(client) {
    const logSchema = require("../Models/Logs");

    function send_log(guildId, embed) {
        logSchema.findOne({ Guild: guildId }, async (err, data) => {
            if(!data) return;
            const LogChannel = client.channels.cache.get(data.Channel);
            embed.setTimestamp();
            LogChannel.send({ embeds: [embed] });
        });
    }


client.on("messageDelete", function (message) {
    if (message.author.bot) return;

    const embed = new EmbedBuilder()
        .setTitle('Message Deleted')
        .setColor(0xef3a1d)
        .setDescription(`
        **Author : ** <@${message.author.id}> - *${message.author.tag}*
        **Date : ** ${message.createdAt}
        **Channel : ** <#${message.channel.id}> - *${message.channel.name}*
        **Deleted Message : **\`${message.content.replace(/`/g, "'")}\`
     `);

    return send_log(message.guild.id, embed);
});
client.on("guildMemberVerify", (member) => {
const embed = new EmbedBuilder()
    .setTitle('Member Accepted Community Rules')
    .setColor(0x2bda3b)
    .setDescription(`
    ${member.user.username} has accepted the community rule gating requirements.`);

return send_log(member.guild.id, embed);
});

// Channel Topic Updating 
client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {

    const embed = new EmbedBuilder()
        .setTitle('Topic Updated!')
        .setColor(0x2bda3b)
        .setDescription(`${channel} Topic changed from **${oldTopic}** to **${newTopic}**`);

    return send_log(channel.guild.id, embed);

});

// Channel Permission Updating
client.on("guildChannelPermissionsUpdate", (channel, oldPermissions, newPermissions) => {

    const embed = new EmbedBuilder()
        .setTitle('Permission Updated!')
        .setColor(0x2bda3b)
        .setDescription(channel.name + 's permissions updated!');

    return send_log(channel.guild.id, embed);

})

// unhandled Guild Channel Update
client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {

    const embed = new EmbedBuilder()
        .setTitle('Channel Updated!')
        .setColor(0x2bda3b)
        .setDescription("Channel '" + oldChannel.id + "' was edited but discord-logs couldn't find what was updated...");

    return send_log(oldChannel.guild.id, embed);

});

// Member Started Boosting
client.on("guildMemberBoost", (member) => {

    const embed = new EmbedBuilder()
        .setTitle('User Started Boosting!')
        .setColor(0xff69b4)
        .setDescription(`**${member.user.tag}** has started boosting  ${member.guild.name}!`);
    return send_log(member.guild.id, embed);

})

// Member Unboosted
client.on("guildMemberUnboost", (member) => {

    const embed = new EmbedBuilder()
        .setTitle('User Stopped Boosting!')
        .setColor(0xff69b4)
        .setDescription(`**${member.user.tag}** has stopped boosting  ${member.guild.name}!`);

    return send_log(member.guild.id, embed);

})

// Member Got Role
client.on("guildMemberRoleAdd", (member, role) => {

    const embed = new EmbedBuilder()
        .setTitle('User Got Role!')
        .setColor(0x2bda3b)
        .setDescription(`**${member.user.tag}** got the role \`${role.name}\``);

    return send_log(member.guild.id, embed);

})

// Member Lost Role
client.on("guildMemberRoleRemove", (member, role) => {

    const embed = new EmbedBuilder()
        .setTitle('User Lost Role!')
        .setColor(0xef3a1d)
        .setDescription(`**${member.user.tag}** lost the role \`${role.name}\``);

    return send_log(member.guild.id, embed);

})

// Nickname Changed
client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {

const embed = new EmbedBuilder()
    .setTitle('Nickname Updated')
    .setColor(0x2bda3b)
    .setDescription(`
    **Author : ** <@${member.user.id}> - *${member.user.tag}*
    ${member.user.tag} changed nickname from \`${oldNickname}\` to \`${newNickname}\``);

return send_log(member.guild.id, embed);
});


// Member Joined
client.on("guildMemberAdd", (member) => {

    const embed = new EmbedBuilder()
        .setTitle('User Joined')
        .setColor(0x2bda3b)
        .setDescription(`Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
            member.user.displayAvatarURL({ dynamic: true }));

    return send_log(member.guild.id, embed);

});

// Member Joined
client.on("guildMemberRemove", (member) => {

    const embed = new EmbedBuilder()
        .setTitle('User Left')
        .setColor(0xef3a1d)
        .setDescription(`Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
            member.user.displayAvatarURL({ dynamic: true }));

    return send_log(member.guild.id, embed);

});

// Server Boost Level Up
client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {

    const embed = new EmbedBuilder()
        .setTitle('Server Boost Level Up')
        .setColor(0xff69b4)
        .setDescription(`${guild.name} reached the boost level ${newLevel}`);

    return send_log(guild.id, embed);

})

// Server Boost Level Down
client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {

    const embed = new EmbedBuilder()
        .setTitle('Server Boost Level Down')
        .setColor(0xff69b4)
        .setDescription(`${guild.name} lost a level from ${oldLevel} to ${newLevel}`);

    return send_log(guild.id, embed);

})

// Banner Added
client.on("guildBannerAdd", (guild, bannerURL) => {

    const embed = new EmbedBuilder()
        .setTitle('Server Got a new banner')
        .setColor(0x2bda3b)
        .setImage(bannerURL)

    return send_log(guild.id, embed);

})

// AFK Channel Added
client.on("guildAfkChannelAdd", (guild, afkChannel) => {

    const embed = new EmbedBuilder()
        .setTitle('AFK Channel Added')
        .setColor(0x2bda3b)
        .setDescription(`${guild.name} has a new afk channel ${afkChannel}`);

    return send_log(guild.id, embed);

})

// Guild Vanity Add
client.on("guildVanityURLAdd", (guild, vanityURL) => {

    const embed = new EmbedBuilder()
        .setTitle('Vanity Link Added')
        .setColor(0x2bda3b)
        .setDescription(`${guild.name} has a vanity link ${vanityURL}`);

    return send_log(guild.id, embed);

})

// Guild Vanity Remove
client.on("guildVanityURLRemove", (guild, vanityURL) => {

    const embed = new EmbedBuilder()
        .setTitle('Vanity Link Removed')
        .setColor(0xef3a1d)
        .setDescription(`${guild.name} has removed its vanity URL ${vanityURL}`);

    return send_log(guild.id, embed);

})

// Guild Vanity Link Updated
client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {

    const embed = new EmbedBuilder()
        .setTitle('Vanity Link Updated')
        .setColor(0x2bda3b)
        .setDescription(`${guild.name} has changed its vanity URL from ${oldVanityURL} to ${newVanityURL}!`);

    return send_log(guild.id, embed);

})

// Message Pinned
client.on("messagePinned", (message) => {

    const embed = new EmbedBuilder()
        .setTitle('Message Pinned')
        .setColor(0x808080)
        .setDescription(`${message} has been pinned by ${message.author}`);

    return send_log(message.guild.id, embed);

})

// Message Edited
client.on("messageContentEdited", (message, oldContent, newContent) => {

    const embed = new EmbedBuilder()
        .setTitle('Message Edited')
        .setColor(0x808080)
        .setDescription(`Message Edited from \`${oldContent}\` to \`${newContent}\` by ${message.author}`);

    return send_log(message.guild.id, embed);

})

// Role Position Updated
client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {

    const embed = new EmbedBuilder()
        .setTitle('Role Position Updated')
        .setColor(0x2bda3b)
        .setDescription(role.name + " role was at position " + oldPosition + " and now is at position " + newPosition);

    return send_log(role.guild.id, embed);

})

// Role Permission Updated
client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {

    const embed = new EmbedBuilder()
        .setTitle('Role Permission Updated')
        .setColor(0x2bda3b)
        .setDescription(role.name + " had as permissions " + oldPermissions + " and now has as permissions " + newPermissions);

    return send_log(role.guild.id, embed);

})

// Username Updated
client.on("userUsernameUpdate", (user, oldUsername, newUsername) => {

    const embed = new EmbedBuilder()
        .setTitle('Username Updated')
        .setColor(0x2bda3b)
        .setDescription(`${user.tag} updated their username from ${oldUsername} to ${newUsername}`);

        return user.guild && send_log(user.guild.id, embed);


})

// Discriminator Updated
client.on("userDiscriminatorUpdate", (user, oldDiscriminator, newDiscriminator) => {

    const embed = new EmbedBuilder()
        .setTitle('Discriminator Updated')
        .setColor(0x2bda3b)
        .setDescription(`${user.tag} updated their discriminator from ${oldDiscriminator} to ${oldDiscriminator}`);

        return send_log(user.guild?.id, embed);


})

// Joined VC
client.on("voiceChannelJoin", (member, channel) => {

    const embed = new EmbedBuilder()
        .setTitle('Voice Channel Joined')
        .setColor(0x2bda3b)
        .setDescription(member.user.tag + " joined " + `${channel}` + "!");

    return send_log(member.guild.id, embed);

})

// Left VC
client.on("voiceChannelLeave", (member, channel) => {

    const embed = new EmbedBuilder()
        .setTitle('Voice Channel Left')
        .setColor(0xef3a1d)
        .setDescription(member.user.tag + " left " + `${channel}` + "!");

    return send_log(member.guild.id, embed);

})

// VC Switch
client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {

    const embed = new EmbedBuilder()
        .setTitle('Voice Channel Switched')
        .setColor(0x2bda3b)
        .setDescription(member.user.tag + " left " + oldChannel.name + " and joined " + newChannel.name + "!");

    return send_log(member.guild.id, embed);

})

// VC Mute
client.on("voiceChannelMute", (member, muteType) => {

    const embed = new EmbedBuilder()
        .setTitle('User Muted')
        .setColor(0xef3a1d)
        .setDescription(member.user.tag + " became muted! (type: " + muteType + ")");

    return send_log(member.guild.id, embed);

})

// VC Unmute
client.on("voiceChannelUnmute", (member, oldMuteType) => {

    const embed = new EmbedBuilder()
        .setTitle('User Unmuted')
        .setColor(0x2bda3b)
        .setDescription(member.user.tag + " became unmuted!");

    return send_log(member.guild.id, embed);

})

// VC Defean
client.on("voiceChannelDeaf", (member, deafType) => {

    const embed = new EmbedBuilder()
        .setTitle('User Deafend')
        .setColor(0xef3a1d)
        .setDescription(member.user.tag + " become deafed!");

    return send_log(member.guild.id, embed);

})

// VC Undefean
client.on("voiceChannelUndeaf", (member, deafType) => {

    const embed = new EmbedBuilder()
        .setTitle('User Undeafend')
        .setColor(0x2bda3b)
        .setDescription(member.user.tag + " become undeafed!");

    return send_log(member.guild.id, embed);

})

// User Started to Stream
client.on("voiceStreamingStart", (member, voiceChannel) => {


    const embed = new EmbedBuilder()
        .setTitle('User Started to Stream')
        .setColor(0x2bda3b)
        .setDescription(member.user.tag + " started streaming in " + voiceChannel.name);

    return send_log(member.guild.id, embed);

})

// User Stopped to Stream
client.on("voiceStreamingStop", (member, voiceChannel) => {


    const embed = new EmbedBuilder()
        .setTitle('User Stopped to Stream')
        .setColor(0xef3a1d)
        .setDescription(member.user.tag + " stopped streaming in " + voiceChannel.name);

    return send_log(member.guild.id, embed);
});

// Member Became Offline
client.on("guildMemberOffline", (member, oldStatus) => {

    const embed = new EmbedBuilder()
        .setTitle('User Offline')
        .setColor(0x2bda3b)
        .setDescription(member ? member.user.tag + " went offline!" : "A user went offline!");

    return send_log(member.guild.id, embed);

});

// Member Became Online
client.on("guildMemberOnline", (member, newStatus) => {

    const embed = new EmbedBuilder()
        .setTitle('User Online')
        .setColor('#2F3136')
        .setDescription(member.user.tag + " was offline and is now " + newStatus + "!");

    return send_log(member.guild.id, embed);

});

// Role Created
client.on("roleCreate", (role) => {

    const embed = new EmbedBuilder()
        .setTitle('Role Added')
        .setColor(0xef3a1d)
        .setDescription(`Role: ${role}\nRolename: ${role.name}\nRoleID: ${role.id}\nHEX Code: ${role.hexColor}\nPosition: ${role.position}`);

    return send_log(role.guild.id, embed);

});

// Role Deleted
client.on("roleDelete", (role) => {

    const embed = new EmbedBuilder()
        .setTitle('Role Deleted')
        .setColor(0xef3a1d)
        .setDescription(`Role: ${role}\nRolename: ${role.name}\nRoleID: ${role.id}\nHEX Code: ${role.hexColor}\nPosition: ${role.position}`);

    return send_log(role.guild.id, embed);

});

// User Banned
client.on("guildBanAdd", ({guild, user}) => {

    const embed = new EmbedBuilder()
        .setTitle('User Banned')
        .setColor(0xef3a1d)
        .setDescription(`User: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
            user.displayAvatarURL({ dynamic: true }));

    return send_log(guild.id, embed);

});

// User Unbanned
client.on("guildBanRemove", ({guild, user}) => {

    const embed = new EmbedBuilder()
        .setTitle('User Unbanned')
        .setColor(0x2bda3b)
        .setDescription(`User: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
            user.displayAvatarURL({ dynamic: true }));

    return send_log(guild.id, embed);

});

// Channel Created
client.on("channelCreate", (channel) => {
const creator = channel.author;
const embed = new EmbedBuilder()
    .setTitle('Channel Created')
    .setColor(0x2bda3b)
    .setDescription(`${channel.name} has been created by ${creator ? creator.mention : "Unknown user"}.`);

return send_log(channel.guild.id, embed);
});

// Channel Deleted
client.on("channelDelete", (channel) => {
const deleter = channel.author;
const embed = new EmbedBuilder()
    .setTitle('Channel Deleted')
    .setColor(0xef3a1d)
    .setDescription(`${channel.name} has been deleted by ${deleter ? deleter.mention : "Unknown user"}.`);

return send_log(channel.guild.id, embed);
});
// Emoji Created
client.on("emojiCreate", (emoji) => {
const embed = new EmbedBuilder()
    .setTitle('Emoji Created')
    .setColor(0x2bda3b)
    .setDescription(`Emoji ${emoji} has been created.`);

return send_log(emoji.guild.id, embed);
});

// Emoji Deleted
client.on("emojiDelete", (emoji) => {
const embed = new EmbedBuilder()
    .setTitle('Emoji Deleted')
    .setColor(0xef3a1d)
    .setDescription(`Emoji ${emoji.name} has been deleted.`);

return send_log(emoji.guild.id, embed);
});

// Emoji Updated
client.on("emojiUpdate", (oldEmoji, newEmoji) => {
const embed = new EmbedBuilder()
    .setTitle('Emoji Updated')
    .setColor(0x2bda3b)
    .setDescription(`Emoji ${oldEmoji.name} has been updated.`);

return send_log(oldEmoji.guild.id, embed);
});
// Server Name Updated
client.on("guildUpdate", (oldGuild, newGuild) => {
if (oldGuild.name !== newGuild.name) {
    const embed = new EmbedBuilder()
        .setTitle('Server Name Updated')
        .setColor(0x2bda3b)
        .setDescription(`Server name changed from \`${oldGuild.name}\` to \`${newGuild.name}\`.`);

    return send_log(newGuild.id, embed);
}
});

// Server Icon Updated
client.on("guildUpdate", (oldGuild, newGuild) => {
if (oldGuild.icon !== newGuild.icon) {
    const embed = new EmbedBuilder()
        .setTitle('Server Icon Updated')
        .setColor(0x2bda3b)
        .setDescription(`Server icon has been updated.`);

    return send_log(newGuild.id, embed);
}
});

// Server Region Updated
client.on("guildUpdate", (oldGuild, newGuild) => {
if (oldGuild.region !== newGuild.region) {
    const embed = new EmbedBuilder()
        .setTitle('Server Region Updated')
        .setColor(0x2bda3b)
        .setDescription(`Server region changed from \`${oldGuild.region}\` to \`${newGuild.region}\`.`);

    return send_log(newGuild.id, embed);
}
});
// Member Changed Avatar
client.on("userAvatarUpdate", (user, oldAvatar, newAvatar) => {
const embed = new EmbedBuilder()
    .setTitle('User Avatar Updated')
    .setColor(0x2bda3b)
    .setDescription(`${user.tag} updated their avatar.`);

return send_log(user.guild?.id, embed);
});
// Server Boost Count Increased
client.on("guildMemberBoost", (member) => {
const embed = new EmbedBuilder()
    .setTitle('Server Boost Count Increased')
    .setColor(0x2bda3b)
    .setDescription(`${member.user.tag} started boosting the server.`);

return send_log(member.guild.id, embed);
});

// Server Boost Count Decreased
client.on("guildMemberUnboost", (member) => {
const embed = new EmbedBuilder()
    .setTitle('Server Boost Count Decreased')
    .setColor(0xef3a1d)
    .setDescription(`${member.user.tag} stopped boosting the server.`);

return send_log(member.guild.id, embed);
});
// Role Created
client.on("roleCreate", (role) => {
const embed = new EmbedBuilder()
    .setTitle('Role Created')
    .setColor(0x2bda3b)
    .setDescription(`Role ${role.name} has been created.`);

return send_log(role.guild.id, embed);
});

// Role Deleted
client.on("roleDelete", (role) => {
const embed = new EmbedBuilder()
    .setTitle('Role Deleted')
    .setColor(0xef3a1d)
    .setDescription(`Role ${role.name} has been deleted.`);

return send_log(role.guild.id, embed);
});
// Message Pinned
client.on("messagePinned", (message) => {
const embed = new EmbedBuilder()
    .setTitle('Message Pinned')
    .setColor(0x808080)
    .setDescription(`${message} has been pinned by ${message.author}.`);

return send_log(message.guild.id, embed);
});

// Message Unpinned
client.on("messageUnpinned", (message) => {
const embed = new EmbedBuilder()
    .setTitle('Message Unpinned')
    .setColor(0x808080)
    .setDescription(`${message} has been unpinned by ${message.author}.`);

return send_log(message.guild.id, embed);
});

// Channel Name Updated
client.on("channelNameUpdate", (channel, oldName, newName) => {
const embed = new EmbedBuilder()
    .setTitle('Channel Name Updated')
    .setColor(0x2bda3b)
    .setDescription(`${channel} name changed from **${oldName}** to **${newName}**`);

return send_log(channel.guild.id, embed);
});

// Channel Position Updated
client.on("channelPositionUpdate", (channel, oldPosition, newPosition) => {
const embed = new EmbedBuilder()
    .setTitle('Channel Position Updated')
    .setColor(0x2bda3b)
    .setDescription(`${channel} position changed from **${oldPosition}** to **${newPosition}**`);

return send_log(channel.guild.id, embed);
});

// Channel NSFW Status Updated
client.on("channelNsfwUpdate", (channel, oldNsfw, newNsfw) => {
const embed = new EmbedBuilder()
    .setTitle('Channel NSFW Status Updated')
    .setColor(0x2bda3b)
    .setDescription(`${channel} NSFW status changed from **${oldNsfw}** to **${newNsfw}**`);

return send_log(channel.guild.id, embed);
});
// Emoji Name Updated
client.on("emojiNameUpdate", (emoji, oldName, newName) => {
const embed = new EmbedBuilder()
    .setTitle('Emoji Name Updated')
    .setColor(0x2bda3b)
    .setDescription(`Emoji ${emoji} name changed from **${oldName}** to **${newName}**`);

return send_log(emoji.guild.id, embed);
});
// Role Color Updated
client.on("roleColorUpdate", (role, oldColor, newColor) => {
const embed = new EmbedBuilder()
    .setTitle('Role Color Updated')
    .setColor(newColor) // Set the color of the embed to the new color
    .setDescription(`Role **${role.name}** color has been updated from ${oldColor} to ${newColor}.`);

return send_log(role.guild.id, embed);
});


// Role Mentionable Status Updated
client.on("roleMentionableUpdate", (role, oldMentionable, newMentionable) => {
const embed = new EmbedBuilder()
    .setTitle('Role Mentionable Status Updated')
    .setColor(0x2bda3b)
    .setDescription(`Role ${role.name} mentionable status changed from **${oldMentionable}** to **${newMentionable}**`);

return send_log(role.guild.id, embed);
});
// Server Owner Changed
client.on("guildOwnerUpdate", (guild, oldOwner, newOwner) => {
const embed = new EmbedBuilder()
    .setTitle('Server Owner Changed')
    .setColor(0x2bda3b)
    .setDescription(`Server owner changed from **${oldOwner.user.tag}** to **${newOwner.user.tag}**`);

return send_log(guild.id, embed);
});

}

module.exports = { handleLogs };