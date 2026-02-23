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

export default {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Start a trivia game!"),
  
  async execute(interaction) {

    await interaction.deferReply();

    const welcomeMsg = `
    Welcome ${userMention(interaction.user.id)}, to the **WaveY Trivia Bot**! 🚀
    To play the game, you will be given trivia questions and **four answers** to choose from.      
    I will then tell you if you are ✅ **correct** or ❌ **incorrect**.
    For help, type \`/\` to see my commands.   
    **Have fun!** 🥳`.trim().split('\n').map(line => line.trim()).join('\n');

    const randomIndex = Math.floor(Math.random() * questions.length);
    const q = questions[randomIndex];

    const letters = ["A", "B", "C", "D"];
    const correctAnswer = letters[q.correctIndex];
    activeTrivia.set(interaction.user.id, { correctAnswer });

    // switched to buttons
    const row = new ActionRowBuilder().addComponents(
      letters.map((letter, index) =>
        new ButtonBuilder()
          .setCustomId(letter)
          .setLabel(`${letter}. ${q.options[index]}`)
          .setStyle(ButtonStyle.Primary)
      )
    );

    await interaction.editReply({
      // displays welcome message every time here
      content: `${welcomeMsg}\n\n🧠 **Trivia Question:**\n${q.question}\n\nChoose an answer below:`,
      components: [row],
    });

    const filter = (i) => i.user.id === interaction.user.id;

    const message = await interaction.fetchReply();

    const collector = message.createMessageComponentCollector({
      filter
    });

    collector.on("collect", async (buttonInteraction) => {
      const userChoice = buttonInteraction.customId;

      const correctLetter = correctAnswer;
      const correctText = q.options[q.correctIndex];

      const { message } = evaluateAnswer(
        userChoice,
        correctLetter,
        correctText
      );

      const disabledRow = new ActionRowBuilder().addComponents(
        row.components.map((button) =>
          ButtonBuilder.from(button).setDisabled(true)
        )
      );

      await buttonInteraction.update({
        content: `🧠 **Trivia Question:**\n${q.question}\n${message}`,
        components: [disabledRow],
      });

      activeTrivia.delete(interaction.user.id);
      collector.stop();
    });
  }
};