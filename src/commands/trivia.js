import { SlashCommandBuilder } from "@discordjs/builders";

const questions = [
  {
    question: "What is the capital of France?",
    answer: "paris",
  },
  {
    question: "What data structure uses FIFO order?",
    answer: "queue",
  },
  {
    question: "Who developed the theory of relativity?",
    answer: "einstein",
  },
];

export default {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Start a trivia game!"),

  async execute(interaction) {
  await interaction.deferReply();

  const randomIndex = Math.floor(Math.random() * questions.length);
  const selectedQuestion = questions[randomIndex];

  await interaction.editReply(`🧠 **Trivia Question:**\n${selectedQuestion.question}`);
},

};

