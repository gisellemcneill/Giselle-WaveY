import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  userMention,
} from "discord.js";

import { activeTrivia } from "../helpers/activeTrivia.js";
import { evaluateAnswer } from "../helpers/evaluateAnswer.js";
import { showScoreboard } from "../helpers/scoreboard.js";

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

    // Cap questions at 10 and implement a timer for each question
    while (true) {
      const session = activeTrivia.get(userId);
      if (!session) break;

      if (session.questionCount >= 10) break;

      const randomIndex = Math.floor(Math.random() * questions.length);
      const q = questions[randomIndex];

      const timedOut = await askQuestion(interaction, userId, q);
      if (timedOut) break;
    }

    await showScoreboard(interaction);
    activeTrivia.delete(userId);
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
      time: 30000,
      max: 1
    });

    //added for the exit command
    session.collector = collector;

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
        if (reason === 'user_exited') {
          return resolve(true); // This breaks the while loop immediately
        }
        
        if (reason === "time" && collected.size === 0) {
          session.questionCount += 1;
          activeTrivia.set(userId, session);

          const correctLetter = letters[q.correctIndex];
          const correctText = q.options[q.correctIndex];

          const disabledRow = new ActionRowBuilder().addComponents(
            row.components.map((button) =>
              ButtonBuilder.from(button).setDisabled(true)
            )
          );

          await questionMessage.edit({
            content:
              `🧠 **Trivia Question:**\n${q.question}\n\n` +
              `⏰ **Time's up!**\n` +
              `The correct answer was **${correctLetter}. ${correctText}**\n\n`,
            components: [disabledRow],
          });
          resolve(true);
        }
    });
  });
}