import { SlashCommandBuilder } from "discord.js";
import { activeTrivia } from "../helpers/activeTrivia.js";
import { showScoreboard } from "../helpers/scoreboard.js";

export default {
  data: new SlashCommandBuilder()
    .setName("exit")
    .setDescription("Exit this round of trivia ✈️"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const session = activeTrivia.get(userId);

    if (!session) {
        return interaction.reply({ content: "No active trivia session! 🤨", flags: 64 });
    }

    // STOP the collector. This triggers the 'end' event in trivia.js
    if (session.collector) {
        session.collector.stop('user_exited');
    }

    // Just acknowledge the exit
    return interaction.reply({ content: "Ending your trivia session...😤", flags: 64 });
  },
};
