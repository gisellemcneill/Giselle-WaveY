import loadFiles from "./loadFiles.js";
import path from "path";
import AsciiTable from "ascii-table";

export async function loadEvents(client, dirName) {
  client.events.clear();

  const files = loadFiles(dirName, ".js");
  const table = new AsciiTable("Events").setHeading("Event", "Status");

  for (const file of files) {
    const { default: event } = await import(path.join(dirName, file));
    const execute = (...args) => event.execute(...args, client);

    client.events.set(event.name, execute);

    if (event.once) client.once(event.name, execute);
    else client.on(event.name, execute);

    table.addRow(file, "✅");
  }

  console.log(table.toString());
}
