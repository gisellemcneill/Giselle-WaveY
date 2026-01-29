import fs from "fs";

export default function loadFiles(dirName, ext) {
  const files = fs.readdirSync(dirName);
  return files.filter(file => file.endsWith(ext));
}
