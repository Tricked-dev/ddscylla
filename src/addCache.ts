import { DB } from "./database.js";

export function addCache(bot) {
  function getAllTable(table) {
    return DB.selectFrom(table, "*");
  }
  function getAllFromGuild(table, guildId) {
    //@ts-ignore -
    return DB.selectFrom(table, "*", { guild_id: guildId.toString() });
  }
  function getId(table, id) {
    //@ts-ignore -
    return DB.selectOneFrom(table, "*", { id: id.toString() });
  }
  function set(table, value) {
    return DB.insertInto(table, value);
  }
  function deleteId(table, id) {
    //@ts-ignore -
    return DB.deleteFrom(table, "*", { id: id.toString() });
  }
  function deleteAllFromGuild(table, guildId) {
    //@ts-ignore -
    return DB.deleteFrom(table, "*", { guild_id: guildId.toString() });
  }
  function deleteAll(table) {
    return DB.truncateTable(table);
  }
  function createGuildCache(table, name, transformer) {
    return {
      async get(id) {
        //@ts-ignore -
        let res = await getId(table, id);
        if (!res) return;
        let role = transformer(bot, {
          //@ts-ignore -
          [name]: res,
          //@ts-ignore -
          guildId: res.guild_id,
        });
        return role;
      },
      async getAll() {
        let data = await getAllTable(table);
        return data.map((data) =>
          //@ts-ignore -
          transformer(bot, { [name]: data, guildId: data.guild_id })
        );
      },
      async getAllRaw() {
        return await getAllTable(table);
      },
      async getAllFromGuild(guildId) {
        let data = await getAllFromGuild(table, guildId);
        return data.map((data) =>
          //@ts-ignore -
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
  bot.cache.guilds = {
    async get(id) {
      //@ts-ignore -
      let res = await DB.selectOneFrom("guilds", "*", { id: id.toString() });
      if (!res) return;
      //@ts-ignore -
      res.a = 1;
      //@ts-ignore -
      res.features = [];
      let guild = bot.oldTransformers.guild(bot, { guild: res });
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
  bot.cache.members = {
    async get(id, guildId) {
      //@ts-ignore -
      let res = await DB.selectOneFrom(
        "members",
        "*",
        //@ts-ignore -
        { id: id.toString(), guild_id: guildId.toString() },
      );
      if (!res) return;
      //@ts-ignore -
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
      //@ts-ignore -
      return DB.deleteFrom(table, "*", {
        //@ts-ignore -
        id: id.toString(),
        guild_id: guildId.toString(),
      });
    },
  };
  bot.cache.users = {
    async get(id) {
      //@ts-ignore -
      let res = await DB.selectOneFrom("users", "*", { id: id.toString() });
      if (!res) return;
      let user = bot.oldTransformers.user(bot, { user: res });
      return user;
    },
    async getAll() {
      let data = await getAllTable("users");
      return data.map((user) => bot.oldTransformers.user(bot, { user }));
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
}
