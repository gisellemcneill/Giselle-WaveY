**CSS 360 WaveY Trivia Discord Bot**

![Image](https://www.ignitesocialmedia.com/wp-content/uploads/2018/02/YpJilaXXT8qJR6HQVKFM_ISM_Trivia.gif)

**Course:** CSS 360

**Team Members:** Jayda, Aditi, Giselle, Audrey

**Overview:**

WaveY Trivia is an interactive Discord bot that lets users play a multiple-choice trivia game directly in a Discord server. 

The bot lets users start a personal trivia session via a slash command. Each game presents the user with randomized questions, tracks the player's score, and provides immediate feedback after each answer.

**Features:**
- Start a game with "/trivia"
- Personalized welcome message with instructions
- Multiple choice questions
- Interactive buttons to choose answers
- Immediate correct/incorrect feedback
- Automatic progression through questions
- The final scoreboard is displayed after 10 questions
- Exit command to end game early with "/exit"

**GamePlay:**

The user can run the "/trivia" command to launch their own trivia game!

To begin the game, the bot will print a personal welcome message with instructions. This will be followed by a question and 4 multiple choice answers. 

After selecting an answer using buttons, the user can then be notified if the answer to the prompted question is correct or incorrect.

The Trivia Bot will post a "Correct!" or "Incorrect!" in the Discord server, and if incorrect, the correct answer will be displayed as well. The bot will also show your score throughout the game. The game consists of 10 questions, so as the game progresses, the bot will update your score and display it in the chat.

The next question will automatically appear for the user after the current question is answered, and no repeat questions will be offered. 

Once the user completes 10 questions, the scoreboard will appear, displaying the number of questions answered and the user's score, and the game ends. 


**Session Management:** 

The bot will only allow one active game session per user, if another instance of a game is attempted the bot will inform the user that they already have an active game going. 

**Ending Game Early:**

If you would like to end the game early, use the "/exit" command to display the scoreboard and end the game immediately, even if you haven't reached the full 10 questions. 

**Running Bot Locally:**

Prerequisites: 
- Node.js(v16 or higher)
- Discord Developer Application
- Registered bot token

SetUp Instructions: 
- Clone the Repository

```bash
git clone <repository-url>`
cd <repository-folder>
```
- Install dependencies
  
```bash 
npm install
```

Create a .env file

```
TOKEN=your_discord_bot_token
CLIENT_ID=your_application_client_id
GUILD_ID=your_test_server_id
```

- Sync slash commands in terminal
(when commands are updated) 

```bash
node deploy-commands.js
```

- Start the bot

```bash
npm start
```

After running:
The bot should respond to /trivia once coming online





