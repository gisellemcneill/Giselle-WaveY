import fs from "fs";
import path from "path";

const dataDir = path.resolve("data");
const filePath = path.join(dataDir, "leaderboard.json");

function ensureFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
  }
}

function readLeaderboardFile() {
  ensureFile();
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw || "{}");
}

function writeLeaderboardFile(data) {
  ensureFile();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function saveAttempt(guildId, userId, username, correct, total) {
  if (!guildId) return;

  const data = readLeaderboardFile();

  if (!data[guildId]) {
    data[guildId] = {};
  }

  if (!data[guildId][userId]) {
    data[guildId][userId] = {
      username,
      attempts: [],
    };
  }

  if (!Array.isArray(data[guildId][userId].attempts)) {
    data[guildId][userId] = {
      username: data[guildId][userId].username || username,
      attempts: [],
    };
  }

  const percent = total === 0 ? 0 : (correct / total) * 100;

  data[guildId][userId].username = username;

  data[guildId][userId].attempts.push({
    percent,
    correct,
    total,
    playedAt: Date.now(),
  });

  writeLeaderboardFile(data);
}

export function getLeaderboard(guildId) {
  if (!guildId) return [];

  const data = readLeaderboardFile();
  if (!data[guildId]) return [];

  const leaderboard = [];

  for (const [userId, userData] of Object.entries(data[guildId])) {
    if (!Array.isArray(userData.attempts)) continue;

    userData.attempts.forEach((attempt, index) => {
      leaderboard.push({
        userId,
        username: userData.username,
        attemptNumber: index + 1,
        percent: attempt.percent,
        correct: attempt.correct,
        total: attempt.total,
        playedAt: attempt.playedAt,
      });
    });
  }

  return leaderboard.sort((a, b) => {
    if (b.percent !== a.percent) return b.percent - a.percent;
    if (b.correct !== a.correct) return b.correct - a.correct;
    return b.playedAt - a.playedAt;
  });
}