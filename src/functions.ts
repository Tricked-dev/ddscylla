export function toDbChannel(channel, guild) {
  return {
    id: channel.id!,
    name: channel.name,
    position: channel.position,
    topic: channel.topic,
    nsfw: channel.nsfw,
    last_message_id: channel.last_message_id,
    bitrate: channel.bitrate,
    user_limit: channel.user_limit,
    rate_limit_per_user: channel.rate_limit_per_user,
    parent_id: channel.parent_id,
    last_pin_id: channel.last_message_id,
    guild_id: guild ?? channel.guild_id,
  };
}
export function toDbUser(user) {
  return {
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
}
export function toDbMember(member, userId, guildId) {
  return {
    id: member.id ?? userId,
    guild_id: guildId,
    nick: member.nick,
    joined_at: member.joined_at,
    premium_since: member.premium_since,
    deaf: member.deaf,
    mute: member.mute,
    pending: member.pending,
    permissions: member.permissions,
  };
}
export function toDbRole(role, guildId) {
  return {
    id: role.id!,
    name: role.name,
    color: role.color,
    hoist: role.hoist,
    position: role.position,
    permissions: role.permissions,
    managed: role.managed,
    mentionable: role.mentionable,
    guild_id: guildId ?? role.guild_id,
  };
}
export function toDbGuild(guild, shardId) {
  return {
    id: guild.id,
    shard: shardId,
    name: guild.name,
    icon: guild.icon,
    splash: guild.splash,
    discovery_splash: guild.discovery_splash,
    owner_id: guild.owner_id,
    permissions: guild.permissions,
    region: guild.region,
    afk_channel_id: guild.afk_channel_id,
    afk_timeout: guild.afk_timeout,
    widget_enabled: guild.widget_enabled,
    widget_channel_id: guild.widget_channel_id,
    verification_level: guild.verification_level,
    default_message_notifications: guild.default_message_notifications,
    explicit_content_filter: guild.explicit_content_filter,
    mfa_level: guild.mfa_level,
    application_id: guild.application_id,
    system_channel_id: guild.system_channel_id,
    system_channel_flags: guild.system_channel_flags,
    rules_channel_id: guild.rules_channel_id,
    joined_at: guild.joined_at ? new Date(guild.joined_at) : undefined,
    large: guild.large,
    unavailable: guild.unavailable,
    member_count: guild.member_count,
  };
}
export function toDbMessage(message) {
  return {
    id: message.id,
    channel_id: message.channel_id,
    guild_id: message.guild_id,
    author_id: message.author.id,
    content: message.content,
    timestamp: message.timestamp,
    edited_timestamp: message.edited_timestamp,
    tts: message.tts,
    mention_everyone: message.mention_everyone,
    pinned: message.pinned,
    webhook_id: message.webhook_id,
    type: message.type,
    message_reference: message.message_reference,
    flags: message.flags,
    referenced_message: message.referenced_message,
  };
}
