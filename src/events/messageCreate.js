import { activeTrivia } from "../helpers/activeTrivia.js";
import { evaluateAnswer } from "../helpers/evaluateAnswer.js";

export default {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    //Old code: 
    //const state = activeTrivia.get(message.author.id);
    //if (!state) return;

    const userId = message.author.id;
    const session = activeTrivia.get(userId);
    if(!session)return; 


    const userAnswer = message.content.trim().toLowerCase();
    if (!["a", "b", "c", "d"].includes(userAnswer)) return;

    const { message: response, correct } = evaluateAnswer(
      userAnswer,
      session.correctAnswer
    );

    await message.reply(response);

    if(correct) session.score += 1; 

    session.questionCount += 1;

    activeTrivia.set(userId, session);

    //get rid of delete since implementing question count/exit command
    //activeTrivia.delete(message.author.id);
  },
};
