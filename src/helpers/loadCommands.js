import fs from "fs";
import path from "path";

export async function loadCommands(client, commandsPath) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const { default: command } = await import(path.join(commandsPath, file));

    if (!command?.data?.name) {
      console.warn(`[WARN] Command ${file} is missing "data.name"`);
      continue;
    }

    client.commands.set(command.data.name, command);
  }
}
