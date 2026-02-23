import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  userMention,
} from "discord.js";

import { activeTrivia } from "../helpers/activeTrivia.js";
import { evaluateAnswer } from "../helpers/evaluateAnswer.js";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctIndex: 2
  },
  {
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctIndex: 1
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Newton", "Tesla", "Einstein", "Galileo"],
    correctIndex: 2
  },
  {
    question: "What year was UW founded?",
    options: ["1861", "1895", "1908", "1920"],
    correctIndex: 0
  }
];
const letters = ["A", "B", "C", "D"]; // moved to global

export default {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Start a trivia game!"),
  
  async execute(interaction) {
    if (!interaction.isRepliable()) return;

    // check if user already has an active trivia session
    const userId = interaction.user.id;

    let deferred = false;
    try {
      await interaction.deferReply();
      deferred = true;
    } catch (e) {
      // deferReply timed out, will try reply() directly
    }

    if (activeTrivia.has(userId)) {
      const msg = `${userMention(userId)}, you already have an active trivia session! Finish it before starting a new one.`
      return deferred ? interaction.editReply(msg) : interaction.reply(msg);
    }

    const welcomeMsg = `
    Welcome ${userMention(userId)}, to the **WaveY Trivia Bot**! 🚀
    To play the game, you will be given trivia questions and **four answers** to choose from.      
    I will then tell you if you are ✅ **correct** or ❌ **incorrect**.
    For help, type \`/\` to see my commands.   
    **Have fun!** 🥳`.trim().split('\n').map(line => line.trim()).join('\n');

    // Store correct answer for THIS user
    activeTrivia.set(userId, {
      // Keep score and count of questions
      score: 0, 
      questionCount: 0
    });

    if (deferred) {
      await interaction.editReply(welcomeMsg);
    } else {
      await interaction.reply(welcomeMsg);
    }

    let questionCount = 0;

    // TODO: this is all currently filler for testing
    while (questionCount < 5) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      const q = questions[randomIndex];
      
      const timedOut = await askQuestion(interaction, userId, q);
      
      // If player timed out, stop the loop
      if (timedOut) return;
      
      questionCount++;
    }

    const finalSession = activeTrivia.get(userId);
    activeTrivia.delete(userId);
    await interaction.followUp(
      `🎉 Game over, ${userMention(userId)}! Final score: **${finalSession.score}/5**\nThanks for playing WaveY Trivia! 🌊`
    );
  },
};

async function askQuestion(interaction, userId, q) {
  const session = activeTrivia.get(userId);
  if (!session) return true;

  const correctLetter = letters[q.correctIndex];

  const row = new ActionRowBuilder().addComponents(
    letters.map((letter, index) =>
      new ButtonBuilder()
        .setCustomId(letter)
        .setLabel(`${letter}. ${q.options[index]}`)
        .setStyle(ButtonStyle.Primary)
    )
  );

  const questionMessage = await interaction.followUp({
    content: `${q.question}\n\nChoose an answer below:`,
    components: [row],
  });

  const filter = (i) => i.user.id === interaction.user.id;

  return new Promise((resolve) => {
    const collector = questionMessage.createMessageComponentCollector({
      filter,
      time: 60000,
      max: 1
    });

    collector.on("collect", async (buttonInteraction) => {
      await buttonInteraction.deferUpdate();

      const userChoice = buttonInteraction.customId;
      const correctText = q.options[q.correctIndex];
      const result = evaluateAnswer(
        userChoice,
        correctLetter,
        correctText
      );

      if (userChoice === correctLetter) {
        session.score += 1;
      }

      session.questionCount += 1;
      activeTrivia.set(userId, session);

      const disabledRow = new ActionRowBuilder().addComponents(
        row.components.map((button) =>
          ButtonBuilder.from(button).setDisabled(true)
        )
      );

      await buttonInteraction.editReply({
        content: `🧠 **Trivia Question:**\n${q.question}\n${result.message}\n\n⭐ Score: ${session.score}/${session.questionCount}`,
        components: [disabledRow],
      });

      resolve(false);      
    });

    collector.on("end", async (collected, reason) => {
        if (reason === "time" && collected.size === 0) {
          activeTrivia.delete(userId);

          const disabledRow = new ActionRowBuilder().addComponents(
            row.components.map((button) =>
              ButtonBuilder.from(button).setDisabled(true)
            )
          );
          await questionMessage.edit({ // TODO: do we want to show the question again when time is up?
            content: `⏰ Time's up!\n\n\n\nTry again with /trivia.🧠 **Trivia Question:**\n${q.question}`,
            components: [disabledRow],
          });
          resolve(true);
        }
    });
  });
}