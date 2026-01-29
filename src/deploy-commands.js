import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';

const commands = [];
const commandsPath = path.join(process.cwd(), 'src/commands');
const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of files) {
  const { default: imported } = await import(path.join(commandsPath, file));
  const command = imported;
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Use GUILD_ID to register for your test server
await rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
  { body: commands }
);

console.log('Slash commands registered!');
