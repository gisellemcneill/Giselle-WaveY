import { activeTrivia } from "../helpers/activeTrivia.js";
import { evaluateAnswer } from "../helpers/evaluateAnswer.js";

export default {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const state = activeTrivia.get(message.author.id);
    if (!state) return;

    const userAnswer = message.content.trim().toLowerCase();
    if (!["a", "b", "c", "d"].includes(userAnswer)) return;

    const { message: response } = evaluateAnswer(
      userAnswer,
      state.correctAnswer
    );

    await message.reply(response);
    activeTrivia.delete(message.author.id);
  },
};
