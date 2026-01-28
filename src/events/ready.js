import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const event = {
  name: "ready",
  once: true,
  async execute(client) {
    client.commands = new Map();

    const commandsPath = path.join(__dirname, "../commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      const { default: command } = await import(
        path.join(commandsPath, file)
      );
      client.commands.set(command.data.name, command);
    }

    console.log(`
############################################################
#  Logged in as ${client.user.username}!
#  Serving ${client.guilds.cache.size} servers.
#  Serving ${client.users.cache.size} users.
############################################################
    `);
  },
};

export default event;
