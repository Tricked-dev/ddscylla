import { ScylloClient } from "scyllo";
import type { CacheInterfaces, ScyllaCacheBot } from "./plugin";

export function addCache(
  bot: ScyllaCacheBot,
) {
  function getAllTable(table) {
    return bot.db.selectFrom(table, "*");
  }
  function getAllFromGuild(table, guildId) {
    return bot.db.selectFrom(table, "*", { guild_id: guildId.toString() });
  }
  function getId(table, id) {
    return bot.db.selectOneFrom(table, "*", { id: id.toString() });
  }
  function set(table, value) {
    return bot.db.insertInto(table, value);
  }
  function deleteId(table, id) {
    return bot.db.deleteFrom(table, "*", { id: id.toString() });
  }
  function deleteAllFromGuild(table, guildId) {
    return bot.db.deleteFrom(table, "*", { guild_id: guildId.toString() });
  }
  function deleteAll(table) {
    return bot.db.truncateTable(table);
  }
  function createGuildCache(table, name, transformer) {
    return {
      async get(id) {
        let res = await getId(table, id);
        if (!res) return;
        let role = transformer(bot, {
          [name]: res,

          guildId: res.guild_id,
        });
        return role;
      },
      async getAll() {
        let data = await getAllTable(table);
        return data.map((data) =>
          transformer(bot, { [name]: data, guildId: data.guild_id })
        );
      },
      async getAllRaw() {
        return await getAllTable(table);
      },
      async getAllFromGuild(guildId) {
        let data = await getAllFromGuild(table, guildId);
        return data.map((data) =>
          transformer(bot, { [name]: data, guildId: data.guild_id })
        );
      },

      async getAllFromGuildRaw(guildId) {
        return await getAllFromGuild(table, guildId);
      },

      async set(value) {
        return await set(table, value);
      },
      async delete(id) {
        return await deleteId(table, id);
      },
      async deleteAllFromGuild(guildId) {
        return await deleteAllFromGuild(table, guildId);
      },
      async deleteAll() {
        return await deleteAll(table);
      },
    };
  }
  bot.cache.roles = createGuildCache(
    "roles",
    "role",
    bot.oldTransformers.role,
  );
  bot.cache.channels = createGuildCache(
    "channels",
    "channel",
    bot.oldTransformers.channel,
  );
  bot.cache.messages = createGuildCache(
    "messages",
    "message",
    bot.oldTransformers.message,
  );
  const guildCache = {
    async get(id) {
      let res = await bot.db.selectOneFrom("guilds", "*", {
        id: id.toString(),
      });
      if (!res) return;

      res.a = 1;

      let guild = bot.transformers.guild(bot, {
        guild: res,
        shardId: res.shard,
      });
      return guild;
    },
    async getAll() {
      let data = await getAllTable("guilds");
      return data.map((guild) => bot.oldTransformers.guild(bot, { guild }));
    },
    async getAllRaw() {
      return await getAllTable("guilds");
    },
    async set(value) {
      return await set("guilds", value);
    },
    async delete(id) {
      return await deleteId("guilds", id);
    },
    async deleteAll() {
      return await deleteAll("guilds");
    },
  };
  const memberCache = {
    async get(id, guildId) {
      let res = await DB.selectOneFrom(
        "members",
        "*",
        { id: id.toString(), guild_id: guildId.toString() },
      );
      if (!res) return;

      res.a = 1;
      let member = bot.oldTransformers.member(bot, { member: res });
      return member;
    },
    async getAll(guildId) {
      let data = await getAllFromGuild("members", guildId);
      return data.map((member) => bot.oldTransformers.member(bot, { member }));
    },
    async getAllRaw(guildId) {
      return await getAllFromGuild("members", guildId);
    },
    async set(value) {
      return await set("members", value);
    },
    async delete(id, guildId) {
      return bot.db.deleteFrom("members", "*", {
        id: id.toString(),
        guild_id: guildId.toString(),
      });
    },
  };
  const userCache = {
    async get(id) {
      let res = await bot.db.selectOneFrom("users", "*", { id: id.toString() });
      if (!res) return;
      let user = bot.oldTransformers.user(bot, res);
      return user;
    },
    async getAll() {
      let data = await getAllTable("users");
      return data.map((user) => bot.oldTransformers.user(bot, user));
    },
    async getAllRaw() {
      return await getAllTable("users");
    },
    async set(value) {
      return await set("users", value);
    },
    async delete(id) {
      return await deleteId("users", id);
    },
    async deleteAll() {
      return await deleteAll("users");
    },
  };
  bot.cache.users = userCache;
  bot.cache.members = memberCache;
  bot.cache.guilds = guildCache;
  return {
    createGuildCache,
    userCache,
    memberCache,
    guildCache,
  };
}
export type GuildItemCache = ReturnType<
  ReturnType<typeof addCache>["createGuildCache"]
>;
export type UserCache = ReturnType<typeof addCache>["userCache"];
export type MemberCache = ReturnType<typeof addCache>["memberCache"];
export type GuildCache = ReturnType<typeof addCache>["guildCache"];
export type Cache = {
  roles: GuildItemCache;
  channels: GuildItemCache;
  messages: GuildItemCache;
  users: UserCache;
  members: MemberCache;
  guilds: GuildCache;
};
