import { ScylloClient } from "scyllo";
import {
  DbChannel,
  DbGuild,
  DbMember,
  DbMessage,
  DbRole,
  DbUser,
} from "./functions";

export const DB = new ScylloClient<
  //@ts-ignore -
  {
    channels: DbChannel;
    roles: DbRole;
    members: DbMember;
    users: DbUser;
    guilds: DbGuild;
    messages: DbMessage;
  }
>({
  client: {
    contactPoints: ["172.17.0.2:9042"], // Where to access the database
    keyspace: "ddcache", // Default keyspace
    localDataCenter: "datacenter1",
  },
});

export async function createTables() {
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
    message_reference: { type: "text" },
    flags: { type: "int" },
    referenced_message: { type: "text" },
  }, "id");
  await DB.createIndex("messages", "messages_by_guild_id", "guild_id");
  await DB.createIndex("messages", "messages_by_channel_id", "channel_id");
  await DB.createIndex("messages", "messages_by_author_id", "author_id");
}
