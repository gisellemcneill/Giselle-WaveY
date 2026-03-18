import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { questions } from "../questions.js"; // questions are now stored in questions.js
import { activeTrivia } from "../helpers/activeTrivia.js";

/**
 * Offer a mini-challenge (bonus question) to the user.
 * Fully handles /exit and timeout features
 */
export async function offerMiniChallenge(interaction, currentScore, currentCategory) {
  const userId = interaction.user.id;
  const session = activeTrivia.get(userId);
  if (!session) return { points: currentScore, sessionData: session };

  // Pick challenge type
  const challengeType = Math.random() < 0.5 ? "popQuiz" : "doublePoints";
  let challenge;
  if (challengeType === "popQuiz") {
    const randomIndex = Math.floor(Math.random() * questions.length);
    challenge = { ...questions[randomIndex], points: 1 };
  } else {
    const categoryQuestions = questions.filter(q => q.category === currentCategory);
    if (categoryQuestions.length === 0) return { points: currentScore, sessionData: session };
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    challenge = { ...categoryQuestions[randomIndex], points: 2 };
  }


  const typeLabel = challengeType === "popQuiz" ? "Pop Quiz" : "Double Points!";
  const bonusEmbed = new EmbedBuilder()
    .setTitle("🎁 BONUS ROUND!")
    .setDescription("Do you want to attempt a bonus question?")
    .addFields({name: "Question Type", value: typeLabel, inline: true})
    .setImage("https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif")
    .setColor("#FFD700");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("accept_mini").setLabel("Accept").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("decline_mini").setLabel("Decline").setStyle(ButtonStyle.Danger)
  );

  const message = await interaction.followUp({ embeds: [bonusEmbed], components: [row], fetchReply: true });
  const filter = i => i.user.id === userId;

  return new Promise(resolve => {
    let resolved = false;
    const safeResolve = (points, sessionData = session) => {
      if (!resolved) {
        resolved = true;
        resolve({ points, sessionData }); // always return session snapshot
      }
    };

    // Collector for accept/decline
    const collector = message.createMessageComponentCollector({ filter, max: 1, time: 30000 });
    session.collector = collector;
    activeTrivia.set(userId, session);

    collector.on("collect", async i => {
      await i.deferUpdate();
      const s = activeTrivia.get(userId);
      if (!s || s.exiting) return safeResolve(currentScore, s || session);

      await message.edit({ components: [] });

      if (i.customId === "accept_mini") {
        const challengeEmbed = new EmbedBuilder()
          .setTitle("🎯 Bonus Question!")
          .setDescription(challenge.question)
          .setColor("#00FF00");

        const optionsRow = new ActionRowBuilder().addComponents(
          challenge.options.map((opt, idx) =>
            new ButtonBuilder().setCustomId(`mini_opt_${idx}`).setLabel(opt).setStyle(ButtonStyle.Primary)
          )
        );

        const questionMessage = await interaction.followUp({ embeds: [challengeEmbed], components: [optionsRow], fetchReply: true });

        const optionCollector = questionMessage.createMessageComponentCollector({ filter, max: 1, time: 30000 });
        session.optionCollector = optionCollector;
        activeTrivia.set(userId, session);

        optionCollector.on("collect", async optInt => {
          const s2 = activeTrivia.get(userId);
          if (!s2 || s2.exiting) return safeResolve(currentScore, s2 || session);

          const selectedIndex = parseInt(optInt.customId.split("_")[2]);
          const selected = challenge.options[selectedIndex];
          const correct = challenge.options[challenge.correctIndex];

          await questionMessage.edit({ components: [] });

          if (selected === correct) {
            currentScore += challenge.points;
            await interaction.followUp({ content: `✅ Correct! You earned ${challenge.points} bonus points.` });
          } else {
            await interaction.followUp({ content: `❌ Wrong! The correct answer was **${correct}**.` });
          }

          safeResolve(currentScore, s2 || session);
        });

        optionCollector.on("end", (collected, reason) => {
          const s2 = activeTrivia.get(userId);
          if (!s2 || s2.exiting) return safeResolve(currentScore, s2 || session);

          if (!collected.size) {
            questionMessage.edit({ components: [] });
            interaction.followUp({ content: "⏰ Time's up! Continuing with the main game." });
            safeResolve(currentScore, s2 || session);
          }
        });

      } else if (i.customId === "decline_mini") {
        await interaction.followUp({ content: "No worries! Continuing with the main game." });
        safeResolve(currentScore, s || session);
      }
    });

    collector.on("end", (collected, reason) => {
      const s = activeTrivia.get(userId);
      if (!s || s.exiting) return safeResolve(currentScore, s || session);

      if (!collected.size) {
        message.edit({ components: [] });
        interaction.followUp({ content: "⏰ No response! Continuing with the main game." });
        safeResolve(currentScore, s || session);
      }
    });
  });
}