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
import "dotenv/config";
import { toDbChannel, toDbGuild, toDbMember, toDbMessage, toDbRole, toDbUser } from "./functions.js";
import { createTables, DB } from "./database.js";
// TODO(later me or some nerd):
// - make bigints work with scylla
// - make a plugin
// - create functions for transforming channels etc
// - channel permissions
// - types? what where are those
// - make ts ignore usage minimal
var bot = createBot({
    token: process.env.TOKEN,
    intents: Intents.GuildMessages | Intents.Guilds | Intents.GuildVoiceStates | Intents.GuildMembers | Intents.GuildMessageReactions,
    events: {
        ready: function ready() {
            console.log("Bot is ready!");
        },
        channelDelete: function channelDelete(bot, channel) {
            return _asyncToGenerator(function() {
                return __generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            //@ts-ignore -
                            return [
                                4,
                                bot.promiseQueue.complete()
                            ];
                        case 1:
                            _state.sent();
                            console.time("channel-delete-".concat(channel.id));
                            //@ts-ignore -
                            return [
                                4,
                                DB.deleteFrom("channels", "*", {
                                    id: channel.id.toString()
                                })
                            ];
                        case 2:
                            _state.sent();
                            console.timeEnd("channel-delete-".concat(channel.id));
                            return [
                                2
                            ];
                    }
                });
            })();
        },
        guildDelete: function guildDelete(bot, guild) {
            return _asyncToGenerator(function() {
                return __generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            //@ts-ignore -
                            return [
                                4,
                                bot.promiseQueue.complete()
                            ];
                        case 1:
                            _state.sent();
                            console.time("guild-delete-".concat(guild));
                            //@ts-ignore -
                            DB.deleteFrom("guilds", "*", {
                                id: guild.toString()
                            });
                            console.timeEnd("guild-delete-".concat(guild));
                            return [
                                2
                            ];
                    }
                });
            })();
        },
        guildMemberRemove: function guildMemberRemove(bot, member, guildId) {
            return _asyncToGenerator(function() {
                return __generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            //@ts-ignore -
                            return [
                                4,
                                bot.promiseQueue.complete()
                            ];
                        case 1:
                            _state.sent();
                            console.time("member-remove-".concat(member.id));
                            //@ts-ignore -
                            DB.deleteFrom("members", "*", {
                                //@ts-ignore -
                                id: member.id.toString(),
                                guildId: guildId.toString()
                            });
                            console.timeEnd("member-remove-".concat(member.id));
                            return [
                                2
                            ];
                    }
                });
            })();
        }
    }
});
var _transformers = bot.transformers, transformMessage = _transformers.message, transformChannel = _transformers.channel, transformGuild = _transformers.guild, transformMember = _transformers.member, transformUser = _transformers.user, transformRole = _transformers.role;
//@ts-ignore -
bot.cache.channels = {
    get: function get(id) {
        return _asyncToGenerator(function() {
            var res, channel;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            DB.selectOneFrom("channels", "*", {
                                id: id.toString()
                            })
                        ];
                    case 1:
                        res = _state.sent();
                        console.log(res);
                        if (!res) return [
                            2
                        ];
                        channel = transformChannel(bot, {
                            //@ts-ignore -
                            channel: res,
                            //@ts-ignore -
                            guildId: res.guild_id
                        });
                        console.log(channel, res);
                        return [
                            2,
                            res
                        ];
                }
            });
        })();
    }
};
// Avoid floating promises
//@ts-ignore -
bot.promiseQueue = {
    queue: [],
    add: function add(promise) {
        this.queue.push(promise);
        if (!this.timeout) {
            var _this = this;
            this.timeout = setTimeout(/*#__PURE__*/ _asyncToGenerator(function() {
                var promises, error;
                return __generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _this.timeout = undefined;
                            promises = _this.queue;
                            _this.queue = [];
                            console.time("completed ".concat(promises.length, " promises"));
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                3,
                                ,
                                4
                            ]);
                            return [
                                4,
                                Promise.all(promises)
                            ];
                        case 2:
                            _state.sent();
                            return [
                                3,
                                4
                            ];
                        case 3:
                            error = _state.sent();
                            console.error(error);
                            return [
                                3,
                                4
                            ];
                        case 4:
                            console.timeEnd("completed ".concat(promises.length, " promises"));
                            return [
                                2
                            ];
                    }
                });
            }), 1000);
        }
        return promise;
    },
    complete: function complete() {
        var promises = this.queue;
        this.queue = [];
        clearTimeout(this.timeout);
        return Promise.all(promises);
    }
};
//@ts-ignore -
bot.transformers.channel = function(bot, payload, inserted) {
    if (inserted || payload.channel.a) return transformChannel(bot, payload);
    console.time("channel-".concat(payload.channel.id));
    bot.promiseQueue.add(DB.insertInto("channels", toDbChannel(payload.channel, payload.guildId)));
    console.timeEnd("channel-".concat(payload.channel.id));
    //@ts-ignore -
    return transformChannel(bot, payload, true);
};
//@ts-ignore -
bot.transformers.user = function(bot, user, inserted) {
    if (inserted || user.a) return transformUser(bot, user);
    console.time("user-".concat(user.id));
    var usr = {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        bot: user.bot,
        system: user.system,
        mfa_enabled: user.mfa_enabled,
        locale: user.locale,
        verified: user.verified
    };
    //@ts-ignore -
    bot.promiseQueue.add(DB.insertInto("users", usr));
    console.timeEnd("user-".concat(user.id));
    //@ts-ignore -
    return transformUser(bot, user, true);
};
//@ts-ignore -
bot.transformers.message = function(bot, message, inserted) {
    if (inserted || message.a) return transformMessage(bot, message);
    console.time("message-".concat(message.id));
    message.a = 1;
    var batch = DB.batch();
    batch.insertInto("messages", toDbMessage(message));
    if (message.member) {
        message.member.a = 1;
        batch.insertInto("members", toDbMember(message.member, message.author_id, message.guild_id));
    }
    message.author.a = 1;
    batch.insertInto("users", toDbUser(message.author));
    bot.promiseQueue.add(batch.execute());
    console.timeEnd("message-".concat(message.id));
    return transformMessage(bot, message);
};
//@ts-ignore
bot.transformers.member = function(bot, member, guildId, userId, inserted) {
    if (inserted || member.a) {
        return transformMember(bot, member, guildId, userId);
    }
    console.time("member-".concat(userId));
    var batch = DB.batch();
    batch.insertInto("members", toDbMember(member, userId, guildId));
    if (member.user) {
        batch.insertInto("users", toDbUser(member.user));
    }
    bot.promiseQueue.add(batch.execute());
    console.timeEnd("member-".concat(userId));
    //@ts-ignore -
    return transformMember(bot, member, guildId, userId, true);
};
//@ts-ignore -
bot.transformers.role = function(bot, payload, inserted) {
    if (inserted || payload.role.a) return transformRole(bot, payload);
    console.time("role-".concat(payload.role.id));
    bot.promiseQueue.add(DB.insertInto("roles", toDbRole(payload.role, payload.guildId)));
    console.timeEnd("role-".concat(payload.role.id));
    //@ts-ignore -
    return transformRole(bot, role, true);
};
//@ts-ignore -
bot.transformers.guild = function(bot, guild, inserted) {
    if (inserted) return transformGuild(bot, guild);
    console.time("guild-".concat(guild.guild.id));
    var batch = DB.batch();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = guild.guild.channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var channel = _step.value;
            channel.a = 1;
            //@ts-ignore -
            batch.insertInto("channels", toDbChannel(channel, guild.guild.id));
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
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        for(var _iterator1 = guild.guild.members[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var member = _step1.value;
            member.a = 1;
            //@ts-ignore -
            batch.insertInto("members", toDbMember(member.user, member.user.id, guild.guild.id));
            if (!member.user) continue;
            member.user.a = 1;
            //@ts-ignore -
            batch.insertInto("users", toDbUser(member.user));
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
    var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
    try {
        for(var _iterator2 = guild.guild.roles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
            var role1 = _step2.value;
            role1.a = 1;
            //@ts-ignore -
            batch.insertInto("roles", toDbRole(role1));
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
    batch.insertInto("guilds", toDbGuild(guild.guild, guild.shard));
    bot.promiseQueue.add(batch.execute());
    console.timeEnd("guild-".concat(guild.guild.id));
    return transformGuild(bot, guild);
};
_asyncToGenerator(function() {
    return __generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    createTables()
                ];
            case 1:
                _state.sent();
                //@ts-ignore -
                bot.cache.channels.get("914295869791162418");
                return [
                    4,
                    startBot(bot)
                ];
            case 2:
                _state.sent();
                return [
                    2
                ];
        }
    });
})();
