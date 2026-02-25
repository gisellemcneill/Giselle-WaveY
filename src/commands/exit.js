import { SlashCommandBuilder } from "discord.js";
import { activeTrivia } from "../helpers/activeTrivia.js";
import { showScoreboard } from "../helpers/scoreboard.js";

export default {
  data: new SlashCommandBuilder()
    .setName("exit")
    .setDescription("Exit this round of trivia."),

  async execute(interaction) {
    // 1. Check if trivia exists first so we can reply with an error if it doesn't
    if (!activeTrivia.has(interaction.user.id)) {
      return interaction.reply({
        content: "There is no active trivia session for you.",
        flags: 64, // Modern ephemeral
      });
    }

    // 2. Acknowledge the command immediately (required before using followUp)
    await interaction.reply({ content: "Ending your session...", flags: 64 });

    // 3. Let the helper handle the rest! 
    // It will find the score, send the GIF embed, and delete the session.
    return showScoreboard(interaction);
  },
};
