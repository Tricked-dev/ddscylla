import { Bot } from "discordeno";
import { ScylloClient } from "scyllo";
import {
  toDbChannel,
  toDbGuild,
  toDbMember,
  toDbMessage,
  toDbRole,
  toDbUser,
} from "./functions.js";
import type {
  DbChannel,
  DbGuild,
  DbMember,
  DbMessage,
  DbRole,
  DbUser,
} from "./functions.js";
import type { ScylloClientOptions } from "scyllo";
import type { Channel } from "discordeno";
import { Cache } from "./addCache.js";
function createPromiseQueue() {
  return {
    queue: [],
    add(promise) {
      this.queue.push(promise);
      if (!this.timeout || this.queue.length > 100) {
        this.timeout = setTimeout(async () => {
          if (!this.queue.length) return;
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
}

export function scyllaDiscordenoPlugin(
  bott: Bot,
  scyllaOptions: ScylloClientOptions,
) {
  let bot = bott as unknown as ScyllaCacheBot;
  bot.promiseQueue = createPromiseQueue();
  if (!scyllaOptions?.client?.keyspace) {
    scyllaOptions = {
      ...scyllaOptions,
      client: {
        ...scyllaOptions?.client,
        keyspace: "ddcache",
      },
    };
  }
  const DB = new ScylloClient<
    //@ts-ignore -
    CacheInterfaces
  >(scyllaOptions);

  async function createTables() {
    await DB.createTable("channels", true, {
      id: { type: "text" },
      name: { type: "text" },
      position: { type: "int" },
      topic: { type: "text" },
      nsfw: { type: "boolean" },
      last_message_id: { type: "text" },
      bitrate: { type: "int" },
      user_limit: { type: "int" },
      rate_limit_per_user: { type: "int" },
      parent_id: { type: "text" },
      last_pin_id: { type: "text" },
      guild_id: { type: "text" },
      type: { type: "int" },
    }, "id");
    await DB.createIndex("channels", "channels_by_guild_id", "guild_id");

    await DB.createTable("roles", true, {
      id: { type: "text" },
      name: { type: "text" },
      color: { type: "int" },
      hoist: { type: "boolean" },
      position: { type: "int" },
      permissions: { type: "text" },
      managed: { type: "boolean" },
      mentionable: { type: "boolean" },
      guild_id: { type: "text" },
    }, "id");
    await DB.createIndex("roles", "roles_by_guild_id", "guild_id");

    await DB.createTable("members", true, {
      id: { type: "text" },
      guild_id: { type: "text" },
      nick: { type: "text" },
      joined_at: { type: "timestamp" },
      premium_since: { type: "timestamp" },
      deaf: { type: "boolean" },
      mute: { type: "boolean" },
      pending: { type: "boolean" },
      permissions: { type: "text" },
    }, ["id", "guild_id"]);
    await DB.createIndex("members", "members_by_guild_id", "guild_id");

    await DB.createTable("users", true, {
      id: { type: "text" },
      username: { type: "text" },
      discriminator: { type: "text" },
      avatar: { type: "text" },
      bot: { type: "boolean" },
      system: { type: "boolean" },
      mfa_enabled: { type: "boolean" },
      locale: { type: "text" },
      verified: { type: "boolean" },
      flags: { type: "int" },
      premium_type: { type: "int" },
      public_flags: { type: "int" },
    }, "id");

    await DB.createTable("guilds", true, {
      id: { type: "text" },
      shard: { type: "int" },
      name: { type: "text" },
      icon: { type: "text" },
      splash: { type: "text" },
      discovery_splash: { type: "text" },
      owner_id: { type: "text" },
      permissions: { type: "text" },
      afk_channel_id: { type: "text" },
      afk_timeout: { type: "int" },
      widget_enabled: { type: "boolean" },
      widget_channel_id: { type: "text" },
      verification_level: { type: "int" },
      default_message_notifications: { type: "int" },
      explicit_content_filter: { type: "int" },
      mfa_level: { type: "int" },
      application_id: { type: "text" },
      system_channel_id: { type: "text" },
      system_channel_flags: { type: "int" },
      rules_channel_id: { type: "text" },
      joined_at: { type: "timestamp" },
      large: { type: "boolean" },
      unavailable: { type: "boolean" },
      member_count: { type: "int" },
    }, "id");

    await DB.createTable("messages", true, {
      id: { type: "text" },
      channel_id: { type: "text" },
      guild_id: { type: "text" },
      author_id: { type: "text" },
      content: { type: "text" },
      timestamp: { type: "timestamp" },
      edited_timestamp: { type: "timestamp" },
      tts: { type: "boolean" },
      mention_everyone: { type: "boolean" },
      pinned: { type: "boolean" },
      webhook_id: { type: "text" },
      type: { type: "int" },
      flags: { type: "int" },
    }, "id");
    await DB.createIndex("messages", "messages_by_guild_id", "guild_id");
    await DB.createIndex("messages", "messages_by_channel_id", "channel_id");
    await DB.createIndex("messages", "messages_by_author_id", "author_id");
  }

  const { channelDelete, guildDelete, guildMemberRemove } = bot.events;
  bot.events.channelDelete = async (_, channel) => {
    await bot.promiseQueue.complete();
    console.time(`channel-delete-${channel.id}`);
    //@ts-ignore -
    await scylla.deleteFrom("channels", "*", { id: channel.id.toString() });
    console.timeEnd(`channel-delete-${channel.id}`);
    return await channelDelete(bot, channel);
  };
  bot.events.guildDelete = async (_, guild, shardId) => {
    await bot.promiseQueue.complete();
    console.time(`guild-delete-${guild}`);
    await DB.deleteFrom("guilds", "*", { id: guild.toString() });
    console.timeEnd(`guild-delete-${guild}`);
    return await guildDelete(bot, guild, shardId);
  };
  bot.events.guildMemberRemove = async (_, member, guildId) => {
    await bot.promiseQueue.complete();
    console.time(`member-remove-${member.id}`);
    await DB.deleteFrom("members", "*", {
      id: member.id.toString(),
      guild_id: guildId.toString(),
    });
    console.timeEnd(`member-remove-${member.id}`);
    return await guildMemberRemove(bot, member, guildId);
  };
  let {
    message: transformMessage,
    channel: transformChannel,
    guild: transformGuild,
    member: transformMember,
    user: transformUser,
    role: transformRole,
  } = bot.transformers;

  bot.oldTransformers = {
    message: transformMessage,
    channel: transformChannel,
    guild: transformGuild,
    member: transformMember,
    user: transformUser,
    role: transformRole,
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
    return transformRole(bot, payload, true);
  };
  //@ts-ignore -
  bot.transformers.guild = (bot, guild, inserted: boolean) => {
    if (!guild.guild.channels) guild.guild.channels = [];
    if (!guild.guild.members) guild.guild.members = [];
    if (!guild.guild.roles) guild.guild.roles = [];
    if (!guild.guild.voice_states) guild.guild.voice_states = [];
    if (!guild.guild.emojis) guild.guild.emojis = [];
    if (!guild.guild.presences) guild.guild.presences = [];
    if (!guild.guild.features) guild.guild.features = [];
    if (inserted || guild?.guild?.a || guild?.a) {
      return transformGuild(bot, guild);
    }

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
  bot.createTables = createTables;
  bot.db = DB;
  return bot;
}
export type CacheInterfaces = {
  channels: DbChannel;
  roles: DbRole;
  members: DbMember;
  users: DbUser;
  guilds: DbGuild;
  messages: DbMessage;
};

export interface ScyllaCacheBot extends Bot {
  db: ScylloClient<
    // @ts-ignore -
    CacheInterfaces
  >;
  promiseQueue: ReturnType<typeof createPromiseQueue>;
  cache: Bot["cache"] & Cache;
  oldTransformers: {
    message: Bot["transformers"]["message"];
    channel: Bot["transformers"]["channel"];
    member: Bot["transformers"]["member"];
    role: Bot["transformers"]["role"];
    guild: Bot["transformers"]["guild"];
    user: Bot["transformers"]["user"];
  };
  createTables: () => Promise<void>;
}
