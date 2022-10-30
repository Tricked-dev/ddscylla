import { createBot, Intents, startBot } from "discordeno";
import { ScylloClient } from "scyllo";
import "dotenv/config";
import {
  toDbChannel,
  toDbGuild,
  toDbMember,
  toDbMessage,
  toDbRole,
  toDbUser,
} from "./functions.js";
import { createTables, DB } from "./database.js";
import { addCache } from "./addCache.js";
// TODO(later me or some nerd):
// - make bigints work with scylla
// - make a plugin
// - channel permissions
// - types? what where are those
// - make ts ignore usage minimal

let bot = createBot({
  token: process.env.TOKEN!,
  intents: Intents.GuildMessages | Intents.Guilds |
    Intents.GuildMessageReactions,
  events: {
    ready() {
      console.log("Bot is ready!");
    },
    async channelDelete(bot, channel) {
      //@ts-ignore -
      await bot.promiseQueue.complete();
      console.time(`channel-delete-${channel.id}`);
      //@ts-ignore -
      await DB.deleteFrom("channels", "*", { id: channel.id.toString() });
      console.timeEnd(`channel-delete-${channel.id}`);
    },
    async guildDelete(bot, guild) {
      //@ts-ignore -
      await bot.promiseQueue.complete();
      console.time(`guild-delete-${guild}`);
      DB.deleteFrom("guilds", "*", { id: guild.toString() });
      console.timeEnd(`guild-delete-${guild}`);
    },
    async guildMemberRemove(bot, member, guildId) {
      //@ts-ignore -
      await bot.promiseQueue.complete();
      console.time(`member-remove-${member.id}`);
      DB.deleteFrom("members", "*", {
        id: member.id.toString(),
        guild_id: guildId.toString(),
      });
      console.timeEnd(`member-remove-${member.id}`);
    },
  },
});

let {
  message: transformMessage,
  channel: transformChannel,
  guild: transformGuild,
  member: transformMember,
  user: transformUser,
  role: transformRole,
} = bot.transformers;

//@ts-ignore -
bot.oldTransformers = {
  message: transformMessage,
  channel: transformChannel,
  guild: transformGuild,
  member: transformMember,
  user: transformUser,
  role: transformRole,
};

//@ts-ignore -
bot.cache.channels = {
  async get(id) {
    //@ts-ignore -
    let res = await DB.selectOneFrom("channels", "*", { id: id.toString() });
    console.log(res);
    if (!res) return;
    let channel = transformChannel(bot, {
      //@ts-ignore -
      channel: res,
      //@ts-ignore -
      guildId: res.guild_id,
    });
    return channel;
  },
  async getRaw(id) {
    //@ts-ignore -
    return await DB.selectOneFrom("channels", "*", { id: id.toString() });
  },
  async set(value) {
    await DB.insertInto("channels", toDbChannel(value, value.guild_id));
  },
  async delete(id) {
    //@ts-ignore -
    await DB.deleteFrom("channels", "*", { id: id.toString() });
  },
};
//@ts-ignore -
bot.cache.roles = {
  async get(id) {
    //@ts-ignore -
    let res = await DB.selectOneFrom("roles", "*", { id: id.toString() });
    if (!res) return;
    let role = transformRole(bot, {
      role: res,
      guildId: res.guild_id as unknown as bigint,
    });
    return role;
  },
  async getRaw(id) {
    return await DB.selectOneFrom("roles", "*", { id: id.toString() });
  },
  async set(value) {
    await DB.insertInto("roles", toDbRole(value, value.guild_id));
  },
  async delete(id) {
    await DB.deleteFrom("roles", "*", { id: id.toString() });
  },
  async getGuildRoles(guildId) {
    let res = await DB.selectFrom("roles", "*", {
      guild_id: guildId.toString(),
    });
    return res.map((r) => transformRole(bot, { role: r, guildId }));
  },
};

// Avoid floating promises
//@ts-ignore -
bot.promiseQueue = {
  queue: [],
  add(promise) {
    this.queue.push(promise);
    if (!this.timeout) {
      this.timeout = setTimeout(async () => {
        this.timeout = undefined;
        let promises = this.queue;

        this.queue = [];
        console.time(`completed ${promises.length} promises`);
        try {
          await Promise.all(promises);
        } catch (error) {
          console.error(error);
        }
        console.timeEnd(`completed ${promises.length} promises`);
      }, 1000);
    }
    return promise;
  },
  complete() {
    let promises = this.queue;
    this.queue = [];
    clearTimeout(this.timeout);
    return Promise.all(promises);
  },
};

//@ts-ignore -
bot.transformers.channel = (bot, payload, inserted: boolean) => {
  if (inserted || payload.channel.a) return transformChannel(bot, payload);
  console.time(`channel-${payload.channel.id}`);

  bot.promiseQueue.add(
    DB.insertInto("channels", toDbChannel(payload.channel, payload.guildId)),
  );
  console.timeEnd(`channel-${payload.channel.id}`);
  //@ts-ignore -
  return transformChannel(bot, payload, true);
};

//@ts-ignore -
bot.transformers.user = (bot, user, inserted: boolean) => {
  if (inserted || user.a) return transformUser(bot, user);
  console.time(`user-${user.id}`);
  let usr = {
    id: user.id,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    bot: user.bot,
    system: user.system,
    mfa_enabled: user.mfa_enabled,
    locale: user.locale,
    verified: user.verified,
  };
  //@ts-ignore -
  bot.promiseQueue.add(DB.insertInto("users", usr));
  console.timeEnd(`user-${user.id}`);
  //@ts-ignore -
  return transformUser(bot, user, true);
};

//@ts-ignore -
bot.transformers.message = (bot, message, inserted: boolean) => {
  if (inserted || message.a) return transformMessage(bot, message);
  console.time(`message-${message.id}`);
  message.a = 1;
  let batch = DB.batch();
  batch.insertInto("messages", toDbMessage(message));
  if (message.member) {
    message.member.a = 1;
    batch.insertInto(
      "members",
      toDbMember(message.member, message.author_id, message.guild_id),
    );
  }

  message.author.a = 1;

  batch.insertInto("users", toDbUser(message.author));
  bot.promiseQueue.add(batch.execute());
  console.timeEnd(`message-${message.id}`);
  return transformMessage(bot, message);
};

//@ts-ignore
bot.transformers.member = (
  bot,
  member,
  guildId,
  userId,
  inserted: boolean,
) => {
  if (inserted || member.a) {
    return transformMember(bot, member, guildId, userId);
  }
  console.time(`member-${userId}`);
  let batch = DB.batch();
  batch.insertInto("members", toDbMember(member, userId, guildId));
  if (member.user) {
    batch.insertInto("users", toDbUser(member.user));
  }
  bot.promiseQueue.add(batch.execute());
  console.timeEnd(`member-${userId}`);
  //@ts-ignore -
  return transformMember(bot, member, guildId, userId, true);
};
//@ts-ignore -
bot.transformers.role = (
  bot,
  payload,
  inserted: boolean,
) => {
  if (inserted || payload.role.a) return transformRole(bot, payload);
  console.time(`role-${payload.role.id}`);

  bot.promiseQueue.add(
    DB.insertInto("roles", toDbRole(payload.role, payload.guildId)),
  );
  console.timeEnd(`role-${payload.role.id}`);
  //@ts-ignore -
  return transformRole(bot, role, true);
};
//@ts-ignore -
bot.transformers.guild = (bot, guild, inserted: boolean) => {
  if (inserted) return transformGuild(bot, guild);
  if (!guild.guild.channels) guild.guild.channels = [];
  if (!guild.guild.members) guild.guild.members = [];
  if (!guild.guild.roles) guild.guild.roles = [];
  if (!guild.guild.voice_states) guild.guild.voice_states = [];
  if (!guild.guild.emojis) guild.guild.emojis = [];
  if (!guild.guild.presences) guild.guild.presences = [];
  if (!guild.guild.features) guild.guild.features = [];

  let batch = DB.batch();
  for (let channel of guild.guild.channels!) {
    channel.a = 1;
    batch.insertInto("channels", toDbChannel(channel, guild.guild.id));
  }
  for (let member of guild.guild.members!) {
    member.a = 1;
    batch.insertInto(
      "members",
      toDbMember(member.user, member.user!.id!, guild.guild.id),
    );
    if (!member.user) continue;

    member.user.a = 1;

    batch.insertInto("users", toDbUser(member.user));
  }
  for (let role of guild.guild.roles!) {
    role.a = 1;
    batch.insertInto("roles", toDbRole(role, guild.guild.id));
  }

  batch.insertInto("guilds", toDbGuild(guild.guild, guild.shard));

  bot.promiseQueue.add((async () => {
    console.time(`guild-${guild.guild.id}`);
    await batch.execute();
    console.timeEnd(`guild-${guild.guild.id}`);
  })());
  return transformGuild(bot, guild);
};

(async () => {
  await createTables();
  addCache(bot);
  // //@ts-ignore -
  // let channel = await bot.cache.channels.getAllFromGuild("755166643927122091");
  // console.log(channel);
  // //@ts-ignore -
  // let guild = await bot.cache.guilds.get("755166643927122091");
  // console.log(guild);

  await startBot(bot);
})();
