import { activeTrivia } from "./activeTrivia.js";
import { userMention } from "discord.js";

export function showScoreboard(interaction) {
  const userId = interaction.user.id;
  const session = activeTrivia.get(userId);
  const score = session?.score || 0;
  const questions = session?.questionCount || 0;

  // Create a flashy embed with fireworks
  const embed = {
    title: `🏆 Trivia Complete! 🎆🎉`,
    description: `${userMention(userId)}, your trivia game has ended!\n\nQuestions answered: **${questions}**\nYour score: **${score}**`,
    image: { 
      // Win GIF
      url: "https://media.tenor.com/L9kNtb5Ak2IAAAAM/congrats-congratulations.gif" 
    },
    color: 0xffd700 // Optional gold color
  };

  // Send the embed
  interaction.followUp({ embeds: [embed], ephemeral: true });

  // Clear the active session
  activeTrivia.delete(userId);
}