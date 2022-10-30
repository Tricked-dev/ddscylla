function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
var __generator = this && this.__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
import { createBot, Intents, startBot } from "discordeno";
import { ScylloClient } from "scyllo";
import "dotenv/config";
var DB = new ScylloClient({
    client: {
        contactPoints: [
            "172.17.0.2:9042"
        ],
        keyspace: "ddcache",
        localDataCenter: "datacenter1"
    }
});
DB.createTable("channels", true, {
    id: {
        type: "bigint"
    },
    name: {
        type: "text"
    },
    position: {
        type: "int"
    },
    topic: {
        type: "text"
    },
    nsfw: {
        type: "boolean"
    },
    lastMessageId: {
        type: "bigint"
    },
    bitrate: {
        type: "int"
    },
    userLimit: {
        type: "int"
    },
    rateLimitPerUser: {
        type: "int"
    },
    parentId: {
        type: "bigint"
    },
    lastPinId: {
        type: "bigint"
    },
    guildId: {
        type: "bigint"
    },
    type: {
        type: "int"
    }
}, "id");
DB.createTable("roles", true, {
    id: {
        type: "bigint"
    },
    name: {
        type: "text"
    },
    color: {
        type: "int"
    },
    hoist: {
        type: "boolean"
    },
    position: {
        type: "int"
    },
    permissions: {
        type: "bigint"
    },
    managed: {
        type: "boolean"
    },
    mentionable: {
        type: "boolean"
    },
    guildId: {
        type: "bigint"
    }
}, "id");
DB.createTable("members", true, {
    id: {
        type: "bigint"
    },
    guildId: {
        type: "bigint"
    },
    nick: {
        type: "text"
    },
    joinedAt: {
        type: "timestamp"
    },
    premiumSince: {
        type: "timestamp"
    },
    deaf: {
        type: "boolean"
    },
    mute: {
        type: "boolean"
    },
    pending: {
        type: "boolean"
    },
    permissions: {
        type: "text"
    }
}, [
    "id",
    "guildId"
]);
DB.createTable("users", true, {
    id: {
        type: "bigint"
    },
    username: {
        type: "text"
    },
    discriminator: {
        type: "text"
    },
    avatar: {
        type: "text"
    },
    bot: {
        type: "boolean"
    },
    system: {
        type: "boolean"
    },
    mfaEnabled: {
        type: "boolean"
    },
    locale: {
        type: "text"
    },
    verified: {
        type: "boolean"
    },
    email: {
        type: "text"
    },
    flags: {
        type: "int"
    },
    premiumType: {
        type: "int"
    },
    publicFlags: {
        type: "int"
    }
}, "id");
DB.createTable("guilds", true, {
    id: {
        type: "bigint"
    },
    name: {
        type: "text"
    },
    icon: {
        type: "text"
    },
    splash: {
        type: "text"
    },
    discoverySplash: {
        type: "text"
    },
    ownerId: {
        type: "bigint"
    },
    afkChannelId: {
        type: "bigint"
    },
    afkTimeout: {
        type: "int"
    },
    widgetEnabled: {
        type: "boolean"
    },
    widgetChannelId: {
        type: "bigint"
    },
    verificationLevel: {
        type: "int"
    },
    defaultMessageNotifications: {
        type: "int"
    },
    explicitContentFilter: {
        type: "int"
    },
    mfaLevel: {
        type: "int"
    },
    applicationId: {
        type: "bigint"
    },
    systemChannelId: {
        type: "bigint"
    },
    systemChannelFlags: {
        type: "int"
    },
    rulesChannelId: {
        type: "bigint"
    },
    joinedAt: {
        type: "timestamp"
    },
    large: {
        type: "boolean"
    },
    unavailable: {
        type: "boolean"
    },
    memberCount: {
        type: "int"
    }
}, "id");
DB.createTable("messages", true, {
    id: {
        type: "bigint"
    },
    channelId: {
        type: "bigint"
    },
    guildId: {
        type: "bigint"
    },
    authorId: {
        type: "bigint"
    },
    content: {
        type: "text"
    },
    timestamp: {
        type: "timestamp"
    },
    editedTimestamp: {
        type: "timestamp"
    },
    tts: {
        type: "boolean"
    },
    mentionEveryone: {
        type: "boolean"
    },
    pinned: {
        type: "boolean"
    },
    webhookId: {
        type: "bigint"
    },
    type: {
        type: "int"
    },
    messageReference: {
        type: "text"
    },
    flags: {
        type: "int"
    },
    referencedMessage: {
        type: "text"
    }
}, "id");
var bot = createBot({
    token: process.env.TOKEN,
    intents: Intents.GuildMessages | Intents.Guilds | Intents.GuildVoiceStates | Intents.GuildMembers | Intents.GuildMessageReactions,
    events: {
        ready: function ready() {
            console.log("Bot is ready!");
        }
    }
});
var _transformers = bot.transformers, transformMessage = _transformers.message, transformChannel = _transformers.channel, transformGuild = _transformers.guild, transformMember = _transformers.member, transformUser = _transformers.user, transformRole = _transformers.role;
//@ts-ignore -
bot.transformers.channel = function() {
    var _ref = _asyncToGenerator(function(bot, payload, inserted) {
        var chnl;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (inserted || payload.channel.a) return [
                        2,
                        transformChannel(bot, payload)
                    ];
                    console.time("channel-".concat(payload.channel.id));
                    chnl = {
                        id: payload.channel.id,
                        name: payload.channel.name,
                        position: payload.channel.position,
                        topic: payload.channel.topic,
                        nsfw: payload.channel.nsfw,
                        lastMessageId: payload.channel.last_message_id,
                        bitrate: payload.channel.bitrate,
                        userLimit: payload.channel.user_limit,
                        rateLimitPerUser: payload.channel.rate_limit_per_user,
                        parentId: payload.channel.parent_id,
                        lastPinId: payload.channel.last_message_id,
                        guildId: payload.channel.guild_id
                    };
                    return [
                        4,
                        DB.insertInto("channels", chnl)
                    ];
                case 1:
                    _state.sent();
                    console.timeEnd("channel-".concat(payload.channel.id));
                    //@ts-ignore -
                    return [
                        2,
                        transformChannel(bot, payload, true)
                    ];
            }
        });
    });
    return function(bot, payload, inserted) {
        return _ref.apply(this, arguments);
    };
}();
//@ts-ignore -
bot.transformers.user = function() {
    var _ref = _asyncToGenerator(function(bot, user, inserted) {
        var usr;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (inserted || user.a) return [
                        2,
                        transformUser(bot, user)
                    ];
                    console.time("user-{user.id}");
                    usr = {
                        id: user.id,
                        username: user.username,
                        discriminator: user.discriminator,
                        avatar: user.avatar,
                        bot: user.bot,
                        system: user.system,
                        mfaEnabled: user.mfa_enabled,
                        locale: user.locale,
                        verified: user.verified
                    };
                    //@ts-ignore -
                    return [
                        4,
                        DB.insertInto("users", usr)
                    ];
                case 1:
                    _state.sent();
                    console.timeEnd("user-{user.id}");
                    //@ts-ignore -
                    return [
                        2,
                        transformUser(bot, user, true)
                    ];
            }
        });
    });
    return function(bot, user, inserted) {
        return _ref.apply(this, arguments);
    };
}();
//@ts-ignore -
bot.transformers.message = function() {
    var _ref = _asyncToGenerator(function(bot, message, inserted) {
        var batch, msg, member, user;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (inserted || message.a) return [
                        2,
                        transformMessage(bot, message)
                    ];
                    console.time("message-".concat(message.id));
                    message.a = 1;
                    batch = DB.batch();
                    msg = {
                        id: message.id,
                        channelId: message.channel_id,
                        guildId: message.guild_id,
                        authorId: message.author.id,
                        content: message.content,
                        timestamp: message.timestamp,
                        editedTimestamp: message.edited_timestamp,
                        tts: message.tts,
                        mentionEveryone: message.mention_everyone,
                        pinned: message.pinned,
                        webhookId: message.webhook_id,
                        type: message.type,
                        messageReference: message.message_reference,
                        flags: message.flags,
                        referencedMessage: message.referenced_message
                    };
                    //@ts-ignore -
                    batch.insertInto("messages", msg);
                    if (message.member) {
                        member = {
                            id: message.author.id,
                            guildId: message.guild_id,
                            nick: message.member.nick,
                            joinedAt: message.member.joined_at,
                            premiumSince: message.member.premium_since,
                            deaf: message.member.deaf,
                            mute: message.member.mute,
                            pending: message.member.pending,
                            permissions: message.member.permissions
                        };
                        message.member.a = 1;
                        //@ts-ignore -
                        batch.insertInto("members", member);
                    }
                    user = {
                        id: message.author.id,
                        username: message.author.username,
                        discriminator: message.author.discriminator,
                        avatar: message.author.avatar,
                        bot: message.author.bot,
                        system: message.author.system,
                        mfaEnabled: message.author.mfa_enabled,
                        locale: message.author.locale,
                        verified: message.author.verified,
                        email: message.author.email,
                        flags: message.author.flags,
                        premiumType: message.author.premium_type,
                        publicFlags: message.author.public_flags
                    };
                    message.author.a = 1;
                    //@ts-ignore -
                    batch.insertInto("users", user);
                    return [
                        4,
                        batch.execute()
                    ];
                case 1:
                    _state.sent();
                    console.timeEnd("message-".concat(message.id));
                    return [
                        2,
                        transformMessage(bot, message)
                    ];
            }
        });
    });
    return function(bot, message, inserted) {
        return _ref.apply(this, arguments);
    };
}();
//@ts-ignore
bot.transformers.member = function() {
    var _ref = _asyncToGenerator(function(bot, member, guildId, userId, inserted) {
        var batch, mem, usr;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (inserted || member.a) {
                        return [
                            2,
                            transformMember(bot, member, guildId, userId)
                        ];
                    }
                    console.time("member-".concat(userId));
                    batch = DB.batch();
                    mem = {
                        id: userId,
                        guildId: guildId,
                        nick: member.nick,
                        joinedAt: member.joined_at,
                        premiumSince: member.premium_since,
                        deaf: member.deaf,
                        mute: member.mute,
                        pending: member.pending,
                        permissions: member.permissions
                    };
                    //@ts-ignore -
                    batch.insert("members", mem);
                    if (member.user) {
                        usr = {
                            id: member.user.id,
                            username: member.user.username,
                            discriminator: member.user.discriminator,
                            avatar: member.user.avatar,
                            bot: member.user.bot,
                            system: member.user.system,
                            mfaEnabled: member.user.mfa_enabled,
                            locale: member.user.locale,
                            verified: member.user.verified,
                            email: member.user.email,
                            flags: member.user.flags,
                            premiumType: member.user.premium_type,
                            publicFlags: member.user.public_flags
                        };
                        //@ts-ignore -
                        batch.insertInto("users", usr);
                    }
                    return [
                        4,
                        batch.execute()
                    ];
                case 1:
                    _state.sent();
                    console.timeEnd("member-".concat(userId));
                    //@ts-ignore -
                    return [
                        2,
                        transformMember(bot, member, guildId, userId, true)
                    ];
            }
        });
    });
    return function(bot, member, guildId, userId, inserted) {
        return _ref.apply(this, arguments);
    };
}();
//@ts-ignore -
bot.transformers.role = function() {
    var _ref = _asyncToGenerator(function(bot, payload, inserted) {
        var batch, rl;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (inserted || payload.role.a) return [
                        2,
                        transformRole(bot, payload)
                    ];
                    console.time("role-".concat(payload.role.id));
                    batch = DB.batch();
                    rl = {
                        id: payload.role.id,
                        guildId: payload.role.guildId,
                        name: payload.role.name,
                        color: payload.role.color,
                        hoist: payload.role.hoist,
                        position: payload.role.position,
                        permissions: payload.role.permissions,
                        managed: payload.role.managed,
                        mentionable: payload.role.mentionable
                    };
                    //@ts-ignore -
                    batch.insertInto("roles", rl);
                    return [
                        4,
                        batch.execute()
                    ];
                case 1:
                    _state.sent();
                    console.timeEnd("role-".concat(payload.role.id));
                    //@ts-ignore -
                    return [
                        2,
                        transformRole(bot, role, true)
                    ];
            }
        });
    });
    return function(bot, payload, inserted) {
        return _ref.apply(this, arguments);
    };
}();
//@ts-ignore -
bot.transformers.guild = function() {
    var _ref = _asyncToGenerator(function(bot, guild, inserted) {
        var batch, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, channel, chnl, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, member, mem, usr, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, role1, rl, gld;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (inserted) return [
                        2,
                        transformGuild(bot, guild)
                    ];
                    console.time("guild-".concat(guild.guild.id));
                    batch = DB.batch();
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = guild.guild.channels[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            channel = _step.value;
                            chnl = {
                                id: channel.id,
                                name: channel.name,
                                position: channel.position,
                                topic: channel.topic,
                                nsfw: channel.nsfw,
                                lastMessageId: channel.last_message_id,
                                bitrate: channel.bitrate,
                                userLimit: channel.user_limit,
                                rateLimitPerUser: channel.rate_limit_per_user,
                                parentId: channel.parent_id,
                                lastPinId: channel.last_message_id,
                                guildId: channel.guild_id
                            };
                            channel.a = 1;
                            //@ts-ignore -
                            batch.insertInto("channels", chnl);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for(_iterator1 = guild.guild.members[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            member = _step1.value;
                            if (!member.user) continue;
                            mem = {
                                id: member.user.id,
                                guildId: guild.guild.id,
                                nick: member.nick,
                                joinedAt: new Date(member.joined_at),
                                premiumSince: member.premium_since ? new Date(member.premium_since) : undefined,
                                deaf: member.deaf,
                                mute: member.mute,
                                pending: member.pending,
                                permissions: member.permissions
                            };
                            member.a = 1;
                            member.user.a = 1;
                            //@ts-ignore -
                            batch.insertInto("members", mem);
                            usr = {
                                id: member.user.id,
                                username: member.user.username,
                                discriminator: member.user.discriminator,
                                avatar: member.user.avatar,
                                bot: member.user.bot,
                                system: member.user.system,
                                mfaEnabled: member.user.mfa_enabled,
                                locale: member.user.locale,
                                verified: member.user.verified,
                                email: member.user.email,
                                flags: member.user.flags,
                                premiumType: member.user.premium_type,
                                publicFlags: member.user.public_flags
                            };
                            //@ts-ignore -
                            batch.insertInto("users", usr);
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally{
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                    _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                    try {
                        for(_iterator2 = guild.guild.roles[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                            role1 = _step2.value;
                            rl = {
                                id: role1.id,
                                name: role1.name,
                                color: role1.color,
                                hoist: role1.hoist,
                                position: role1.position,
                                permissions: role1.permissions,
                                managed: role1.managed,
                                mentionable: role1.mentionable,
                                guildId: guild.guild.id
                            };
                            role1.a = 1;
                            //@ts-ignore -
                            batch.insertInto("roles", rl);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                _iterator2.return();
                            }
                        } finally{
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                    gld = {
                        id: guild.guild.id,
                        name: guild.guild.name,
                        icon: guild.guild.icon,
                        splash: guild.guild.splash,
                        discoverySplash: guild.guild.discovery_splash,
                        ownerId: guild.guild.owner_id,
                        afkChannelId: guild.guild.afk_channel_id,
                        afkTimeout: guild.guild.afk_timeout,
                        widgetEnabled: guild.guild.widget_enabled,
                        widgetChannelId: guild.guild.widget_channel_id,
                        verificationLevel: guild.guild.verification_level,
                        defaultMessageNotifications: guild.guild.default_message_notifications,
                        explicitContentFilter: guild.guild.explicit_content_filter,
                        mfaLevel: guild.guild.mfa_level,
                        applicationId: guild.guild.application_id,
                        systemChannelId: guild.guild.system_channel_id,
                        systemChannelFlags: guild.guild.system_channel_flags,
                        rulesChannelId: guild.guild.rules_channel_id,
                        joinedAt: guild.guild.joined_at ? new Date(guild.guild.joined_at) : undefined,
                        large: guild.guild.large,
                        unavailable: guild.guild.unavailable,
                        memberCount: guild.guild.member_count
                    };
                    //@ts-ignore -
                    batch.insertInto("guilds", gld);
                    return [
                        4,
                        batch.execute()
                    ];
                case 1:
                    _state.sent();
                    console.timeEnd("guild-".concat(guild.guild.id));
                    return [
                        2,
                        transformGuild(bot, guild)
                    ];
            }
        });
    });
    return function(bot, guild, inserted) {
        return _ref.apply(this, arguments);
    };
}();
startBot(bot);
