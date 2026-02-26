import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  userMention,
  InteractionContextType,
} from "discord.js";

import { activeTrivia } from "../helpers/activeTrivia.js";
import { evaluateAnswer } from "../helpers/evaluateAnswer.js";
import { showScoreboard } from "../helpers/scoreboard.js";

const questions = [
  // STEM (20 questions)
  { question: "Which data structure follows FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correctIndex: 1, category: "stem" },
  { question: "Who developed the theory of relativity?", options: ["Newton", "Tesla", "Einstein", "Galileo"], correctIndex: 2, category: "stem" },
  { question: "What is the smallest element on the periodic table by atomic number?", options: ["Natrium", "Lithium", "Beryllium", "Hydrogen"], correctIndex: 3, category: "stem" },
  { question: "How many bones are in the human body?", options: [ "210","206", "195", "220"], correctIndex: 1, category: "stem" },
  { question: "What is 0! (zero factorial)?", options: ["0", "1", "Undefined", "Infinity"], correctIndex: 1, category: "stem" },
  { question: "What is Amazon's cloud computing platform called?", options: ["AWS", "Google Cloud", "Azure", "IBM Cloud"], correctIndex: 0, category: "stem" },
  { question: "Researchers from which company helped develop the first successful quantum computer?", options: ["Google", "Salesforce", "D-Wave", "IBM"], correctIndex: 3, category: "stem" },
  { question: "The process of converting sensitive or complex data into smaller, manageable, or non-sensitive units is called?", options: ["Encryption", "Tokenization", "Hashing", "Anonymization"], correctIndex: 1, category: "stem" },
  { question: "Which programming language is known for its use in data science and machine learning?", options: ["Java", "C++", "Python", "Ruby"], correctIndex: 2, category: "stem" },
  { question: "What is Microsoft's analytics platform called?", options: ["Fabric", "Tableau", "Azure", "Office 365"], correctIndex: 0, category: "stem" },
  { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Gd", "Go"], correctIndex: 0, category: "stem" },
  { question: "What planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Saturn"], correctIndex: 0, category: "stem" },
  { question: "What is the square root of 144?", options: ["10", "12", "14", "16"], correctIndex: 1, category: "stem" },
  { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correctIndex: 1, category: "stem" },
  { question: "Which organ in the human body produces insulin?", options: ["Liver", "Pancreas", "Kidney", "Stomach"], correctIndex: 1, category: "stem" },
  { question: "What is H2O commonly known as?", options: ["Hydrogen Peroxide", "Water", "Oxygen", "Salt"], correctIndex: 1, category: "stem" },
  { question: "What force keeps planets in orbit around the sun?", options: ["Magnetism", "Gravity", "Friction", "Centrifugal"], correctIndex: 1, category: "stem" },
  { question: "Which element is a noble gas?", options: ["Helium", "Oxygen", "Nitrogen", "Carbon"], correctIndex: 0, category: "stem" },
  { question: "Which number is a prime number?", options: ["15", "21", "17", "27"], correctIndex: 2, category: "stem" },
  { question: "What is the chemical formula for table salt?", options: ["NaCl", "KCl", "NaHCO3", "CaCl2"], correctIndex: 0, category: "stem" },

  // Shows & Movies (20 questions)
  { question: "What was the biggest movie in terms of box office revenue in 2023?", options: ["Avatar: The Way of Water", "Wicked", "Barbie", "Oppenheimer"], correctIndex: 2, category: "shows_movies" },
  { question: "What was the biggest movie in terms of box office revenue in 2025?", options: ["Zootopia 2", "Avatar: Fire and Ash", "Superman", "Wicked 2"], correctIndex: 0, category: "shows_movies" },
  { question: "Which show features the character Eleven?", options: ["Stranger Things", "The Witcher", "Breaking Bad", "Friends"], correctIndex: 0, category: "shows_movies" },
  { question: "Who played Jack in Titanic?", options: ["Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp"], correctIndex: 0, category: "shows_movies" },
  { question: "Which movie has the quote 'May the Force be with you'?", options: ["Star Wars", "Star Trek", "Guardians of the Galaxy", "Avatar"], correctIndex: 0, category: "shows_movies" },
  { question: "Which animated movie features a talking snowman named Olaf?", options: ["Frozen", "Moana", "Tangled", "Encanto"], correctIndex: 0, category: "shows_movies" },
  { question: "Which show is set in the fictional town of Hawkins?", options: ["Stranger Things", "The Umbrella Academy", "Riverdale", "Outer Banks"], correctIndex: 0, category: "shows_movies" },
  { question: "Who played Hermione in the Harry Potter series?", options: ["Emma Watson", "Daniel Radcliffe", "Rupert Grint", "Natalie Portman"], correctIndex: 0, category: "shows_movies" },
  { question: "Which movie is part of the Marvel Cinematic Universe?", options: ["Iron Man", "Inception", "Jurassic Park", "Titanic"], correctIndex: 0, category: "shows_movies" },
  { question: "Which show features a coffee shop called Central Perk?", options: ["Friends", "How I Met Your Mother", "The Office", "Seinfeld"], correctIndex: 0, category: "shows_movies" },
  { question: "Which movie features the character Elsa?", options: ["Frozen", "Tangled", "Brave", "Moana"], correctIndex: 0, category: "shows_movies" },
  { question: "Which series has the characters Daenerys and Jon Snow?", options: ["Game of Thrones", "Vikings", "The Witcher", "The Mandalorian"], correctIndex: 0, category: "shows_movies" },
  { question: "Who voices Woody in Toy Story?", options: ["Tom Hanks", "Tim Allen", "Robin Williams", "Billy Crystal"], correctIndex: 0, category: "shows_movies" },
  { question: "Which movie features the song 'Let It Go'?", options: ["Frozen", "Moana", "Encanto", "Tangled"], correctIndex: 0, category: "shows_movies" },
  { question: "Who played the Joker in the 2019 movie?", options: ["Joaquin Phoenix", "Heath Ledger", "Jack Nicholson", "Jared Leto"], correctIndex: 0, category: "shows_movies" },
  { question: "Which TV show has a character named Sheldon Cooper?", options: ["The Big Bang Theory", "Friends", "Modern Family", "Community"], correctIndex: 0, category: "shows_movies" },
  { question: "Which movie series features characters named Woody and Buzz Lightyear?", options: ["Toy Story", "Shrek", "Ice Age", "Madagascar"], correctIndex: 0, category: "shows_movies" },
  { question: "Which movie features the Avengers?", options: ["The Avengers", "Justice League", "Inception", "The Matrix"], correctIndex: 0, category: "shows_movies" },
  { question: "Which show features a character named Rick Sanchez?", options: ["Rick and Morty", "Futurama", "The Simpsons", "South Park"], correctIndex: 0, category: "shows_movies" },

  //Geography & History (20 questions) 
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correctIndex: 2, category: "geography_history" },
  { question: "When did the US declare independence?", options: ["1712", "1776", "1804", "1812"], correctIndex: 1, category: "geography_history" },
  { question: "Which continent has the most countries?", options: ["Africa", "Asia", "Europe", "South America"], correctIndex: 0, category: "geography_history" },
  { question: "What is the capital of Finland?", options: ["Oslo", "Stockholm", "Copenhagen", "Helsinki"], correctIndex: 3, category: "geography_history" },
  { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correctIndex: 2, category: "geography_history" },
  { question: "How many countries are in the European Union (EU) as of 2024?", options: ["28", "30", "32","27"], correctIndex: 3, category: "geography_history" },
  { question: "Who was the first President of the United States?", options: ["George Washington", "John Adams", "Thomas Jefferson", "James Madison"], correctIndex: 0, category: "geography_history" },
  { question: "Which ancient civilization built the pyramids?", options: ["Egyptians", "Romans", "Greeks", "Mayans"], correctIndex: 0, category: "geography_history" },
  { question: "Which war ended in 1945?", options: ["WWI", "WWII", "Vietnam War", "Korean War"], correctIndex: 1, category: "geography_history" },
  { question: "Which river runs through Egypt?", options: ["Nile", "Amazon", "Mississippi", "Yangtze"], correctIndex: 0, category: "geography_history" },
  { question: "What year did the Berlin Wall fall?", options: ["1987","1989","1991","1993"], correctIndex: 1, category: "geography_history" },
  { question: "Who discovered America?", options: ["Christopher Columbus","Leif Erikson","Ferdinand Magellan","Amerigo Vespucci"], correctIndex: 0, category: "geography_history" },
  { question: "Which country hosted the 2016 Summer Olympics?", options: ["China","Brazil","UK","Russia"], correctIndex: 1, category: "geography_history" },
  { question: "What is the capital of Japan?", options: ["Seoul","Beijing","Tokyo","Bangkok"], correctIndex: 2, category: "geography_history" },
  { question: "Who was known as the Maid of Orléans?", options: ["Joan of Arc","Marie Curie","Queen Elizabeth","Catherine the Great"], correctIndex: 0, category: "geography_history" },
  { question: "Which empire was ruled by Genghis Khan?", options: ["Mongol","Ottoman","Roman","Persian"], correctIndex: 0, category: "geography_history" },
  { question: "Which US state is known as the 'Sunshine State'?", options: ["California","Florida","Texas","Arizona"], correctIndex: 1, category: "geography_history" },
  { question: "Which country is famous for the Colosseum?", options: ["Greece","Italy","Spain","Egypt"], correctIndex: 1, category: "geography_history" },
  { question: "Which city is the capital of Canada?", options: ["Toronto","Vancouver","Ottawa","Montreal"], correctIndex: 2, category: "geography_history" },
  { question: "Which country was known as Persia?", options: ["Iraq","Iran","Turkey","Afghanistan"], correctIndex: 1, category: "geography_history" },

  // Pop Culture (20 questions)
  { question: "Which artist released the hit song 'Shape of You'?", options: ["Ed Sheeran", "Drake", "Adele", "Bruno Mars"], correctIndex: 0, category: "pop_culture" },
  { question: "Which social media platform has the bird logo?", options: ["Twitter", "Instagram", "Facebook", "TikTok"], correctIndex: 0, category: "pop_culture" },
  { question: "Which celebrity hosted SNL in 2023?", options: ["Billie Eilish", "Tom Holland", "Zendaya", "Elon Musk"], correctIndex: 2, category: "pop_culture" },
  { question: "Which video game features Mario and Luigi?", options: ["Mario Kart", "Zelda", "Sonic", "Fortnite"], correctIndex: 0, category: "pop_culture" },
  { question: "Which streaming platform has 'Stranger Things'?", options: ["Netflix", "Disney+", "HBO Max", "Amazon Prime"], correctIndex: 0, category: "pop_culture" },
  { question: "Which artist is known as the 'King of Pop'?", options: ["Elvis Presley","Michael Jackson","Prince","Justin Timberlake"], correctIndex: 1, category: "pop_culture" },
  { question: "Which film won Best Picture at the 2020 Oscars?", options: ["1917","Joker","Parasite","Ford v Ferrari"], correctIndex: 2, category: "pop_culture" },
  { question: "Who is the creator of the Star Wars franchise?", options: ["George Lucas","Steven Spielberg","James Cameron","J.J. Abrams"], correctIndex: 0, category: "pop_culture" },
  { question: "Which singer released 'Bad Guy' in 2019?", options: ["Billie Eilish","Ariana Grande","Dua Lipa","Taylor Swift"], correctIndex: 0, category: "pop_culture" },
  { question: "Which movie features a character named Shrek?", options: ["Shrek","Madagascar","Kung Fu Panda","Ice Age"], correctIndex: 0, category: "pop_culture" },
  { question: "Which pop star performed at the Super Bowl halftime show in 2020?", options: ["Shakira & JLo","Beyonce","Lady Gaga","Bruno Mars"], correctIndex: 0, category: "pop_culture" },
  { question: "Which TV show has the characters Eleven, Mike, and Dustin?", options: ["Stranger Things","The Umbrella Academy","The Witcher","Outer Banks"], correctIndex: 0, category: "pop_culture" },
  { question: "Which singer is famous for 'Rolling in the Deep'?", options: ["Adele","Beyonce","Rihanna","Katy Perry"], correctIndex: 0, category: "pop_culture" },
  { question: "Which movie series features a character named Katniss Everdeen?", options: ["The Hunger Games","Divergent","Twilight","Maze Runner"], correctIndex: 0, category: "pop_culture" },
  { question: "Which social media platform is known for short video clips?", options: ["TikTok","Instagram","Snapchat","Facebook"], correctIndex: 0, category: "pop_culture" },
  { question: "Which superhero is played by Robert Downey Jr.?", options: ["Iron Man","Batman","Spider-Man","Captain America"], correctIndex: 0, category: "pop_culture" },
  { question: "Which movie franchise includes the character Jack Sparrow?", options: ["Pirates of the Caribbean","Harry Potter","Lord of the Rings","Star Wars"], correctIndex: 0, category: "pop_culture" },
  { question: "Which singer released 'Hello' in 2015?", options: ["Adele","Taylor Swift","Ed Sheeran","Beyonce"], correctIndex: 0, category: "pop_culture" },
  { question: "Which TV series features Sheldon Cooper?", options: ["The Big Bang Theory","Friends","Modern Family","Community"], correctIndex: 0, category: "pop_culture" },
  { question: "Which video game features Link as the main character?", options: ["The Legend of Zelda","Mario Kart","Sonic","Fortnite"], correctIndex: 0, category: "pop_culture" }
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
      questionCount: 0,
      asked : [] // Track asked questions to avoid repeats
    });

    if (deferred) {
      await interaction.editReply(welcomeMsg);
    } else {
      await interaction.reply(welcomeMsg);
    }

//SELECT THE CATEGORY 

//categoies being offered
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
//promise = pause the code until the user clicks a category or it times out
const categorySelected = new Promise((resolve) => {
  //create a collector that waits for the selected user to pick a button
  const collector = categoryMessage.createMessageComponentCollector({
    filter: i => i.user.id === userId,
    max: 1,
    time: 30000, // 30s to pick category
  });

  //collecter picks up selection from the user
  collector.on("collect", async (buttonInteraction) => {
    
    // get user session to store category 
    const session = activeTrivia.get(buttonInteraction.user.id);
    if (!session) { //if no session, inform the user
      console.error("Session missing for user!");
      return resolve(false);
    }

//pulls the category and saves it to the user session
    const chosenCategory = buttonInteraction.customId.replace("category_", "");
    session.category = chosenCategory;
    activeTrivia.set(buttonInteraction.user.id, session);

    // confirm category and remove buttons
    await buttonInteraction.update({
      content: `You chose **${buttonInteraction.component.label}**! Let's start the trivia. 🎉`,
      components: [],
    });

    //resolves the promise that user 
    resolve(true); // only resolve after category is saved
  });

  //handles the timeout case
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
//debugging 
//console.log("AFTER CATEGORY:", sessionAfterCategory);

    // Cap questions at 10 and implement a timer for each question
   while (true) {
  const session = activeTrivia.get(userId);
  if (!session) break;

  //testing
  console.log("SESSION CATEGORY:", session.category);
console.log("MATCHING QUESTIONS:", questions.filter(q => q.category === session.category).length);

  const categoryQuestions = questions.filter(q => q.category === session.category);

  // stop after 10 questions
  if (session.questionCount >= 10) break;

  // make sure session.asked exists (in case things got moved)
  if (!Array.isArray(session.asked)) session.asked = [];

  // stop if we run out of unique questions
  if (session.asked.length >= categoryQuestions.length) break;

  // pick an unused question index
  let randomIndex = Math.floor(Math.random() * categoryQuestions.length);
  while (session.asked.includes(randomIndex)) {
    randomIndex = Math.floor(Math.random() * categoryQuestions.length);
  }

  session.asked.push(randomIndex);
  activeTrivia.set(userId, session);

  const q = categoryQuestions[randomIndex];

  // ask question; if user explicitly exited, end session
  const endedSession = await askQuestion(interaction, userId, q);
  if (endedSession) break;
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
