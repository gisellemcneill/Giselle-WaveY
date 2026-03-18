import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  userMention,
} from "discord.js";

import { questions } from "../questions.js"; // questions are now stored in questions.js
import { activeTrivia } from "../helpers/activeTrivia.js";
import { evaluateAnswer } from "../helpers/evaluateAnswer.js";
import { showScoreboard } from "../helpers/scoreboard.js";
import { offerMiniChallenge } from "../helpers/miniChallenge.js";

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
      📢 **READ BEFORE YOU START PLAYING:** 📢
      1) To start off, you can choose the category and difficulty you want to play in, and then we will get started!
      2) To play the game, you will be given trivia questions and **four answers** to choose from.   
      3) I will then tell you if you are ✅ **correct** or ❌ **incorrect**, and tell you the correct answer.
      4) You can play up to 10 questions per game, and your score will be tracked along the way.
      5) If you are lucky you could be offered up to two bonus questions! 
          Pop Quiz: A random question from any category for 1 extra point.
          Double Points: A question from your chosen category that is worth 2 points instead of 1!
        You will be given 30 seconds to accept or decline the bonus question 🙋
      6) You also have 30 seconds to answer each question, so be quick! ⏰ 
      All the best, and may the trivia odds be ever in your favor! 🏆
      **Note:** If you want to exit the game early, use the command "/exit" to end your session and see your final score.
      **Have fun!** 🥳`.trim().split('\n').map(line => line.trim()).join('\n');

    // Store correct answer for THIS user
    activeTrivia.set(userId, {
      // Keep score and count of questions
      score: 0, 
      questionCount: 0,
      streak: 0,
      maxStreak: 0,
      asked : [] // Track asked questions to avoid repeats
    });

    if (deferred) {
      await interaction.editReply(welcomeMsg);
    } else {
      await interaction.reply(welcomeMsg);
    }

    // SELECT THE CATEGORY 

    // categoies being offered
    const categories = ["STEM", "Shows & Movies", "Geography & History", "Pop Culture"];

    // create row of buttons, all different colors! 
    // success = green, primary = blue, danger = red, secondary = grey 
    const categoryButtons = new ActionRowBuilder().addComponents(
      [
        { name: "STEM", style: ButtonStyle.Success },
        { name: "Shows & Movies", style: ButtonStyle.Success },
        { name: "Geography & History", style: ButtonStyle.Success },
        { name: "Pop Culture", style: ButtonStyle.Success },
      ].map(cat =>
        new ButtonBuilder()
          .setCustomId(`category_${cat.name.toLowerCase().replace(/ & /g, "_").replace(/ /g,"_")}`)
          .setLabel(cat.name)
          .setStyle(cat.style)
      )
    );

    // send message prompting user to pick category
    const categoryMessage = await interaction.followUp({
      content: "Choose a category to start your trivia game! 🎯",
      components: [categoryButtons],
    });

    // set up a promise to wait until user selects a category or time runs out
    // promise = pause the code until the user clicks a category or it times out
    const categorySelected = new Promise((resolve) => {
      // create a collector that waits for the selected user to pick a button
      const collector = categoryMessage.createMessageComponentCollector({
        filter: i => i.user.id === userId,
        max: 1,
        time: 30000, // 30s to pick category
      });

      // collecter picks up selection from the user
      collector.on("collect", async (buttonInteraction) => {
        // get user session to store category 
        const session = activeTrivia.get(buttonInteraction.user.id);
        if (!session) { // if no session, inform the user
          console.error("Session missing for user!");
          return resolve(false);
        }

        // pulls the category and saves it to the user session
        const chosenCategory = buttonInteraction.customId.replace("category_", "");
        session.category = chosenCategory;
        activeTrivia.set(buttonInteraction.user.id, session);

        // confirm category and remove buttons
        await buttonInteraction.update({
          content: `You chose **${buttonInteraction.component.label}**! `,
          components: [],
        });

        // resolves the promise that user 
        resolve(true); // only resolve after category is saved
      });

      // handles the timeout case
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          await categoryMessage.edit({
            content: "⏰ You didn’t choose a category in time!",
            components: [],
          });
          resolve(false);
        }
      });
  });

  // wait for user to pick category
  const categorySuccess = await categorySelected;

  // check if valid category was selected
  const sessionAfterCategory = activeTrivia.get(userId);
  if (!categorySuccess || !sessionAfterCategory?.category) {
    activeTrivia.delete(userId);
    return;
  }

  // ADD DIFFICULTY SELECTION
  const difficultyButtons = new ActionRowBuilder().addComponents(
    [
      { name: "Easy", style: ButtonStyle.Success },
      { name: "Medium", style: ButtonStyle.Primary },
      { name: "Hard", style: ButtonStyle.Danger },
    ].map(diff =>
      new ButtonBuilder()
        .setCustomId(`difficulty_${diff.name.toLowerCase()}`)
        .setLabel(diff.name)
        .setStyle(diff.style)
    )
  );

  const difficultyMessage = await interaction.followUp({
    content: "Now choose your difficulty! 💪",
    components: [difficultyButtons],
  });

  const difficultySelected = new Promise((resolve) => {
    const collector = difficultyMessage.createMessageComponentCollector({
      filter: i => i.user.id === userId,
      max: 1,
      time: 30000,
    });

    collector.on("collect", async (buttonInteraction) => {
      const session = activeTrivia.get(buttonInteraction.user.id);
      if (!session) return resolve(false);

      const chosenDifficulty = buttonInteraction.customId.replace("difficulty_", "");
      session.difficulty = chosenDifficulty;
      activeTrivia.set(buttonInteraction.user.id, session);

      await buttonInteraction.update({
        content: `Difficulty set to **${buttonInteraction.component.label}**! Good luck 🍀`,
        components: [],
      });

      resolve(true);
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        await difficultyMessage.edit({
          content: "⏰ You didn't choose a difficulty in time!",
          components: [],
        });
        resolve(false);
      }
    });
  });

  const difficultySuccess = await difficultySelected;
  const sessionAfterDifficulty = activeTrivia.get(userId);
  if (!difficultySuccess || !sessionAfterDifficulty?.difficulty) {
    activeTrivia.delete(userId);
    return;
  }

  //MINI CHALLENGE VARIABLES - initialize in session after category selection
  // After category selection, offer the mini challenge
  const session = activeTrivia.get(userId);
  session.miniChallengeCount = 0;
  session.miniChallengeScore = 0; 
  activeTrivia.set(userId, session);

//main trivia logic
while (true) {
  const session = activeTrivia.get(userId);
  if (!session) break;

  // offer mini challenge before next round
  if (session.miniChallengeCount < 2 && Math.random() < 0.2) {
    session.miniChallengeCount += 1;
    activeTrivia.set(userId, session);

    try {
      // Pause the loop until mini challenge is done
    const result = await offerMiniChallenge(interaction, session.miniChallengeScore, session.category);
// result now contains both points AND sessionData
const { points: newMiniScore, sessionData: resolvedSession } = result;

// EXIT CHECK
if (!resolvedSession || resolvedSession.exiting) {
  await showScoreboard(interaction, {
    score: resolvedSession.score,
    questionCount: resolvedSession.questionCount,
    miniChallengeScore: resolvedSession.miniChallengeScore
  });
  activeTrivia.delete(userId);
  break;
}

const bonusEarned = newMiniScore - session.miniChallengeScore;
session.miniChallengeScore = newMiniScore;
session.score += bonusEarned;
activeTrivia.set(userId, session);

    } catch (err) {
      console.error("Mini-challenge failed:", err);
    }
  }


  // Filter questions for this category
  const categoryQuestions = questions.filter(
    q => q.category === session.category && q.difficulty == session.difficulty);

  // Stop after 10 questions
  if (session.questionCount >= 10) break;

  // Ensure session.asked exists
  if (!Array.isArray(session.asked)) session.asked = [];

  // Stop if all questions have been asked
  if (session.asked.length >= categoryQuestions.length) break;

  // Pick a random unused question
  let randomIndex = Math.floor(Math.random() * categoryQuestions.length);
  while (session.asked.includes(randomIndex)) {
    randomIndex = Math.floor(Math.random() * categoryQuestions.length);
  }
  session.asked.push(randomIndex);
  activeTrivia.set(userId, session);

  const q = categoryQuestions[randomIndex];

  // Ask the question and pause the loop until answered
  const endedSession = await askQuestion(interaction, userId, q);
  if (endedSession) break;
}

// --- SHOW FINAL SCOREBOARD ---
const finalSession = activeTrivia.get(userId);
if (finalSession) {
  await showScoreboard(interaction, {
    score: finalSession.score,
    questionCount: finalSession.questionCount,
    miniChallengeScore: finalSession.miniChallengeScore
  });
}
activeTrivia.delete(userId);

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
        session.streak += 1;

        // Update maxStreak if current streak is higher
        if (session.streak > session.maxStreak) {
          session.maxStreak = session.streak;
        }
      } else {
        session.streak = 0; // Reset streak on wrong answer
      }

      session.questionCount += 1;
      activeTrivia.set(userId, session);

      // Create the 🔥 visual
      let streakEmoji = "";
      if (session.streak >= 3 && session.streak < 5) streakEmoji = " 🔥";
      if (session.streak >= 5 && session.streak < 8) streakEmoji = " 🧨";
      if (session.streak >= 8) streakEmoji = " ☄️ SUPERNOVA!!";

      const streakDisplay = session.streak >= 3 
        ? `\n**Streak: ${session.streak}${streakEmoji}**` 
        : "";

      // Map through components to change colors
      const updatedRow = new ActionRowBuilder().addComponents(
        row.components.map((button) => {
          const buttonData = ButtonBuilder.from(button);
          const buttonId = button.data.custom_id;

          if (buttonId === correctLetter) {
            // Always turn the correct answer Green
            buttonData.setStyle(ButtonStyle.Success);
          } else if (buttonId === userChoice && userChoice !== correctLetter) {
            // If user picked this and it's wrong, turn it Red
            buttonData.setStyle(ButtonStyle.Danger);
          } else {
            // Keep others Grey/Secondary so they don't distract
            buttonData.setStyle(ButtonStyle.Secondary);
          }

          return buttonData.setDisabled(true); // Disable all
        })
      );

      // Edit the original message with the new colors and streak
      await buttonInteraction.editReply({
        content: `🧠 **Trivia Question:**\n${q.question}\n${result.message}${streakDisplay}\n\n⭐ Score: ${session.score}/${session.questionCount}\n\n 🎁 Bonus Points: ${session.miniChallengeScore || 0} \n\n`,
        components: [updatedRow],
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
}}};