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
import { addCache } from "./addCache.js";
// TODO(later me or some nerd):
// - make bigints work with scylla
// - make a plugin
// - channel permissions
// - types? what where are those
// - make ts ignore usage minimal
