import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { loadEvents, loadCommands } from "./helpers/index.js";
import path from "path";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.User,
    Partials.Message,
    Partials.GuildMember,
    Partials.ThreadMember
  ]
});

client.events = new Collection();
client.commands = new Collection();

await loadEvents(client, path.join(process.cwd(), "src/events"));
await loadCommands(client, path.join(process.cwd(), "src/commands"));

client.login(process.env.TOKEN);

