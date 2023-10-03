const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
    // SERVER ID
    id: mongoose.SchemaTypes.String,
    ownerId: mongoose.SchemaTypes.String,

    // PROTECCIÓN
    protection: {
        antiraid: {
            enable: mongoose.SchemaTypes.Boolean,
            amount: mongoose.SchemaTypes.Number,
            saveBotsEntrities: {
                authorOfEntry: mongoose.SchemaTypes.String,
                _bot: mongoose.SchemaTypes.String
            }
        },
        antibots: {
            enable: mongoose.SchemaTypes.Boolean,
            _type: mongoose.SchemaTypes.String
        },
        antitokens: {
            enable: mongoose.SchemaTypes.Boolean,
            usersEntrities: mongoose.SchemaTypes.Array,
            entritiesCount: mongoose.SchemaTypes.Number
        },
        antijoins: {
            enable: mongoose.SchemaTypes.Boolean,
            rememberEntrities: mongoose.SchemaTypes.Array
        },
        markMalicious: {
            enable: mongoose.SchemaTypes.Boolean,
            _type: mongoose.SchemaTypes.String,
            rememberEntrities: mongoose.SchemaTypes.Array
        },
        warnEntry: mongoose.SchemaTypes.Boolean,
        kickMalicious: {
            enable: mongoose.SchemaTypes.Boolean,
            rememberEntrities: mongoose.SchemaTypes.Array
        },
        ownSystem: {
            enable: mongoose.SchemaTypes.Boolean,
            events: {
                messageCreate: mongoose.SchemaTypes.Array,
                messageDelete: mongoose.SchemaTypes.Array,
                messageUpdate: mongoose.SchemaTypes.Array,
                channelCreate: mongoose.SchemaTypes.Array,
                channelDelete: mongoose.SchemaTypes.Array,
                channelUpdate: mongoose.SchemaTypes.Array,
                roleCreate: mongoose.SchemaTypes.Array,
                roleDelete: mongoose.SchemaTypes.Array,
                roleUpdate: mongoose.SchemaTypes.Array,
                emojiCreate: mongoose.SchemaTypes.Array,
                emojiDelete: mongoose.SchemaTypes.Array,
                emojiUpdate: mongoose.SchemaTypes.Array,
                stickerCreate: mongoose.SchemaTypes.Array,
                stickerDelete: mongoose.SchemaTypes.Array,
                stickerUpdate: mongoose.SchemaTypes.Array,
                guildMemberAdd: mongoose.SchemaTypes.Array,
                guildMemberRemove: mongoose.SchemaTypes.Array,
                guildMemberUpdate: mongoose.SchemaTypes.Array,
                guildBanAdd: mongoose.SchemaTypes.Array,
                guildBanRemove: mongoose.SchemaTypes.Array,
                inviteCreate: mongoose.SchemaTypes.Array,
                inviteDelete: mongoose.SchemaTypes.Array,
                threadCreate: mongoose.SchemaTypes.Array,
                threadDelete: mongoose.SchemaTypes.Array
            }
        },
        verification: {
            enable: mongoose.SchemaTypes.Boolean,
            _type: mongoose.SchemaTypes.String,
            channel: mongoose.SchemaTypes.String,
            role: mongoose.SchemaTypes.String
        },
        cannotEnterTwice: {
            enable: mongoose.SchemaTypes.Boolean,
            users: mongoose.SchemaTypes.Array
        },
        purgeWebhooksAttacks: {
            enable: mongoose.SchemaTypes.Boolean,
            amount: mongoose.SchemaTypes.Number,
            rememberOwners: mongoose.SchemaTypes.String
        },
        intelligentSOS: {
            enable: mongoose.SchemaTypes.Boolean,
            cooldown: mongoose.SchemaTypes.Boolean
        },
        intelligentAntiflood: mongoose.SchemaTypes.Boolean,
        antiflood: mongoose.SchemaTypes.Boolean,
        bloqEntritiesByName: {
            enable: mongoose.SchemaTypes.Boolean,
            names: mongoose.SchemaTypes.Array
        },
        bloqNewCreatedUsers: {
            time: mongoose.SchemaTypes.String
        },
        raidmode: {
            enable: mongoose.SchemaTypes.Boolean,
            timeToDisable: mongoose.SchemaTypes.String,
            password: mongoose.SchemaTypes.String,
            activedDate: mongoose.SchemaTypes.Number
        }
    },

    // MODERACIÓN
    moderation: {
        dataModeration: {
            muterole: mongoose.SchemaTypes.String,
            forceReasons: mongoose.SchemaTypes.Array,
            timers: mongoose.SchemaTypes.Array,
            badwords: mongoose.SchemaTypes.Array,
            events: {
                manyPings: mongoose.SchemaTypes.Boolean,
                capitalLetters: mongoose.SchemaTypes.Boolean,
                manyEmojis: mongoose.SchemaTypes.Boolean,
                manyWords: mongoose.SchemaTypes.Boolean,
                linkDetect: mongoose.SchemaTypes.Boolean,
                ghostping: mongoose.SchemaTypes.Boolean,
                nsfwFilter: mongoose.SchemaTypes.Boolean,
                iploggerFilter: mongoose.SchemaTypes.Boolean
            }
        },
        automoderator: {
            enable: mongoose.SchemaTypes.Boolean,
            actions: {
                warns: mongoose.SchemaTypes.Array,
                muteTime: mongoose.SchemaTypes.Array,
                action: mongoose.SchemaTypes.String,
                linksToIgnore: mongoose.SchemaTypes.Array,
                floodDetect: mongoose.SchemaTypes.Number,
                manyEmojis: mongoose.SchemaTypes.Number,
                manyPings: mongoose.SchemaTypes.Number,
                manyWords: mongoose.SchemaTypes.Number,
            },
            events: {
                badwordDetect: mongoose.SchemaTypes.Boolean,
                floodDetect: mongoose.SchemaTypes.Boolean,
                manyPings: mongoose.SchemaTypes.Boolean,
                capitalLetters: mongoose.SchemaTypes.Boolean,
                manyEmojis: mongoose.SchemaTypes.Boolean,
                manyWords: mongoose.SchemaTypes.Boolean,
                linkDetect: mongoose.SchemaTypes.Boolean,
                ghostping: mongoose.SchemaTypes.Boolean,
                nsfwFilter: mongoose.SchemaTypes.Boolean,
                iploggerFilter: mongoose.SchemaTypes.Boolean
            }
        }
    },

    // CONFIGURACIÓN
    configuration: {
        _version: mongoose.SchemaTypes.String,
        prefix: mongoose.SchemaTypes.String,
        whitelist: mongoose.SchemaTypes.Array,
        logs: mongoose.SchemaTypes.Array,
        language: mongoose.SchemaTypes.String,
        ignoreChannels: mongoose.SchemaTypes.Array,
        password: {
            enable: mongoose.SchemaTypes.Boolean,
            _password: mongoose.SchemaTypes.String,
            usersWithAcces: mongoose.SchemaTypes.Array,
        },
        subData: {
            showDetailsInCmdsCommand: mongoose.SchemaTypes.String,
            pingMessage: mongoose.SchemaTypes.String,
            dontRepeatTheAutomoderatorAction: mongoose.SchemaTypes.Boolean
        }
    },
});

module.exports = mongoose.model('spagency_Guild', guildsSchema);