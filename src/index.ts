import { createBot, Intents, startBot } from "discordeno";
import { ScylloClient } from "scyllo";
import "dotenv/config";

const DB = new ScylloClient({
  client: {
    contactPoints: ["172.17.0.2:9042"], // Where to access the database
    keyspace: "ddcache", // Default keyspace
    localDataCenter: "datacenter1",
  },
});

DB.createTable("channels", true, {
  id: { type: "bigint" },
  name: { type: "text" },
  position: { type: "int" },
  topic: { type: "text" },
  nsfw: { type: "boolean" },
  lastMessageId: { type: "bigint" },
  bitrate: { type: "int" },
  userLimit: { type: "int" },
  rateLimitPerUser: { type: "int" },
  parentId: { type: "bigint" },
  lastPinId: { type: "bigint" },
  guildId: { type: "bigint" },
  type: { type: "int" },
  //@ts-ignore -
}, "id");

DB.createTable("roles", true, {
  id: { type: "bigint" },
  name: { type: "text" },
  color: { type: "int" },
  hoist: { type: "boolean" },
  position: { type: "int" },
  permissions: { type: "bigint" },
  managed: { type: "boolean" },
  mentionable: { type: "boolean" },
  guildId: { type: "bigint" },
  //@ts-ignore -
}, "id");

DB.createTable("members", true, {
  id: { type: "bigint" },
  guildId: { type: "bigint" },
  nick: { type: "text" },
  joinedAt: { type: "timestamp" },
  premiumSince: { type: "timestamp" },
  deaf: { type: "boolean" },
  mute: { type: "boolean" },
  pending: { type: "boolean" },
  permissions: { type: "text" },
  //@ts-ignore -
}, ["id", "guildId"]);

DB.createTable("users", true, {
  id: { type: "bigint" },
  username: { type: "text" },
  discriminator: { type: "text" },
  avatar: { type: "text" },
  bot: { type: "boolean" },
  system: { type: "boolean" },
  mfaEnabled: { type: "boolean" },
  locale: { type: "text" },
  verified: { type: "boolean" },
  email: { type: "text" },
  flags: { type: "int" },
  premiumType: { type: "int" },
  publicFlags: { type: "int" },
  //@ts-ignore -
}, "id");

DB.createTable("guilds", true, {
  id: { type: "bigint" },
  name: { type: "text" },
  icon: { type: "text" },
  splash: { type: "text" },
  discoverySplash: { type: "text" },
  ownerId: { type: "bigint" },
  afkChannelId: { type: "bigint" },
  afkTimeout: { type: "int" },
  widgetEnabled: { type: "boolean" },
  widgetChannelId: { type: "bigint" },
  verificationLevel: { type: "int" },
  defaultMessageNotifications: { type: "int" },
  explicitContentFilter: { type: "int" },
  mfaLevel: { type: "int" },
  applicationId: { type: "bigint" },
  systemChannelId: { type: "bigint" },
  systemChannelFlags: { type: "int" },
  rulesChannelId: { type: "bigint" },
  joinedAt: { type: "timestamp" },
  large: { type: "boolean" },
  unavailable: { type: "boolean" },
  memberCount: { type: "int" },
  //@ts-ignore -
}, "id");

DB.createTable("messages", true, {
  id: { type: "bigint" },
  channelId: { type: "bigint" },
  guildId: { type: "bigint" },
  authorId: { type: "bigint" },
  content: { type: "text" },
  timestamp: { type: "timestamp" },
  editedTimestamp: { type: "timestamp" },
  tts: { type: "boolean" },
  mentionEveryone: { type: "boolean" },
  pinned: { type: "boolean" },
  webhookId: { type: "bigint" },
  type: { type: "int" },
  messageReference: { type: "text" },
  flags: { type: "int" },
  referencedMessage: { type: "text" },
  //@ts-ignore -
}, "id");

let bot = createBot({
  token: process.env.TOKEN!,
  intents: Intents.GuildMessages | Intents.Guilds | Intents.GuildVoiceStates |
    Intents.GuildMembers | Intents.GuildMessageReactions,
  events: {
    ready() {
      console.log("Bot is ready!");
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
bot.transformers.channel = async (bot, payload, inserted: boolean) => {
  if (inserted || payload.channel.a) return transformChannel(bot, payload);
  console.time(`channel-${payload.channel.id}`);
  let chnl = {
    id: payload.channel.id!,
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
    guildId: payload.channel.guild_id,
  };
  await DB.insertInto("channels", chnl);
  console.timeEnd(`channel-${payload.channel.id}`);
  //@ts-ignore -
  return transformChannel(bot, payload, true);
};

//@ts-ignore -
bot.transformers.user = async (bot, user, inserted: boolean) => {
  if (inserted || user.a) return transformUser(bot, user);
  console.time(`user-{user.id}`);
  let usr = {
    id: user.id,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    bot: user.bot,
    system: user.system,
    mfaEnabled: user.mfa_enabled,
    locale: user.locale,
    verified: user.verified,
  };
  //@ts-ignore -
  await DB.insertInto("users", usr);
  console.timeEnd(`user-{user.id}`);
  //@ts-ignore -
  return transformUser(bot, user, true);
};

//@ts-ignore -
bot.transformers.message = async (bot, message, inserted: boolean) => {
  if (inserted || message.a) return transformMessage(bot, message);
  console.time(`message-${message.id}`);
  message.a = 1;
  let batch = DB.batch();
  let msg = {
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
    referencedMessage: message.referenced_message,
  };
  //@ts-ignore -
  batch.insertInto("messages", msg);
  if (message.member) {
    let member = {
      id: message.author.id,
      guildId: message.guild_id,
      nick: message.member.nick,
      joinedAt: message.member.joined_at,
      premiumSince: message.member.premium_since,
      deaf: message.member.deaf,
      mute: message.member.mute,
      pending: message.member.pending,
      permissions: message.member.permissions,
    };
    message.member.a = 1;
    //@ts-ignore -
    batch.insertInto("members", member);
  }
  let user = {
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
    publicFlags: message.author.public_flags,
  };
  message.author.a = 1;
  //@ts-ignore -
  batch.insertInto("users", user);
  await batch.execute();
  console.timeEnd(`message-${message.id}`);
  return transformMessage(bot, message);
};

//@ts-ignore
bot.transformers.member = async (
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

  let mem = {
    id: userId,
    guildId: guildId,
    nick: member.nick,
    joinedAt: member.joined_at,
    premiumSince: member.premium_since,
    deaf: member.deaf,
    mute: member.mute,
    pending: member.pending,
    permissions: member.permissions,
  };
  //@ts-ignore -
  batch.insert("members", mem);
  if (member.user) {
    let usr = {
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
      publicFlags: member.user.public_flags,
    };
    //@ts-ignore -
    batch.insertInto("users", usr);
  }
  await batch.execute();
  console.timeEnd(`member-${userId}`);
  //@ts-ignore -
  return transformMember(bot, member, guildId, userId, true);
};
//@ts-ignore -
bot.transformers.role = async (
  bot,
  payload,
  inserted: boolean,
) => {
  if (inserted || payload.role.a) return transformRole(bot, payload);
  console.time(`role-${payload.role.id}`);
  let batch = DB.batch();
  let rl = {
    id: payload.role.id,
    guildId: payload.role.guildId,
    name: payload.role.name,
    color: payload.role.color,
    hoist: payload.role.hoist,
    position: payload.role.position,
    permissions: payload.role.permissions,
    managed: payload.role.managed,
    mentionable: payload.role.mentionable,
  };
  //@ts-ignore -
  batch.insertInto("roles", rl);
  await batch.execute();
  console.timeEnd(`role-${payload.role.id}`);
  //@ts-ignore -
  return transformRole(bot, role, true);
};
//@ts-ignore -
bot.transformers.guild = async (bot, guild, inserted: boolean) => {
  if (inserted) return transformGuild(bot, guild);
  console.time(`guild-${guild.guild.id}`);
  let batch = DB.batch();
  for (let channel of guild.guild.channels!) {
    let chnl = {
      id: channel.id!,
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
      guildId: channel.guild_id,
    };
    channel.a = 1;
    //@ts-ignore -
    batch.insertInto("channels", chnl);
  }
  for (let member of guild.guild.members!) {
    if (!member.user) continue;
    let mem = {
      id: member.user!.id!,
      guildId: guild.guild.id,
      nick: member.nick,
      joinedAt: new Date(member.joined_at),
      premiumSince: member.premium_since
        ? new Date(member.premium_since)
        : undefined,
      deaf: member.deaf,
      mute: member.mute,
      pending: member.pending,
      permissions: member.permissions,
    };
    member.a = 1;
    member.user.a = 1;
    //@ts-ignore -
    batch.insertInto("members", mem);

    let usr = {
      id: member.user!.id!,
      username: member.user!.username,
      discriminator: member.user!.discriminator,
      avatar: member.user!.avatar,
      bot: member.user!.bot,
      system: member.user!.system,
      mfaEnabled: member.user!.mfa_enabled,
      locale: member.user!.locale,
      verified: member.user!.verified,
      email: member.user!.email,
      flags: member.user!.flags,
      premiumType: member.user!.premium_type,
      publicFlags: member.user!.public_flags,
    };

    //@ts-ignore -
    batch.insertInto("users", usr);
  }
  for (let role of guild.guild.roles!) {
    let rl = {
      id: role.id!,
      name: role.name,
      color: role.color,
      hoist: role.hoist,
      position: role.position,
      permissions: role.permissions,
      managed: role.managed,
      mentionable: role.mentionable,
      guildId: guild.guild.id,
    };
    role.a = 1;
    //@ts-ignore -
    batch.insertInto("roles", rl);
  }
  let gld = {
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
    joinedAt: guild.guild.joined_at
      ? new Date(guild.guild.joined_at)
      : undefined,
    large: guild.guild.large,
    unavailable: guild.guild.unavailable,
    memberCount: guild.guild.member_count,
  };
  //@ts-ignore -
  batch.insertInto("guilds", gld);

  await batch.execute();
  console.timeEnd(`guild-${guild.guild.id}`);
  return transformGuild(bot, guild);
};

startBot(bot);
