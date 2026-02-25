import { userMention } from "discord.js";

// const CHANNEL_NAME = process.env.CHANNEL_NAME;
//const MEME_URL = process.env.MEME_URL || "";

// const event = {
//   name: "guildMemberAdd",
//   async execute(member) {
//     const channel = member.guild.channels.cache.find(
//       (channel) => channel.name === CHANNEL_NAME
//     );


//     /*
//       TODO: Change getWelcomeMessage to getWelcomeMessageWithMeme to send a meme to welcome your user.
//     */
//     const welcomeMessage = await getWelcomeMessage(member.id);
//     channel.send(welcomeMessage);
//   },
// };

const getWelcomeMessage = (userId) => {
  /*
    Welcome message when a new member joins.
    This is the bot's intro message. Customize as needed.
  */
  return {
    content: `Welcome ${userMention(userId)}, to the **WaveY Trivia Bot** server! 🚀

To play the game, you will be given trivia questions and **four answers** to choose from. 
    
I will then tell you if you are ✅ **right** or ❌ **wrong**.

For help, type \`/\` to see my commands. 
    
**Have fun!** 🥳`,
  };
};

//
// const getWelcomeMessageWithMeme = async (userId) => {
//   /*
//     this function returns a welcome message with a meme.
//     Play around with the code here and customise the welcome message.

//     TODO: Change this function to return different welcome message with a meme everytime a new user joins.
//   */
//   const meme = await getWelcomeMeme();

//   return {
//     content: `Welcome ${userMention(userId)},
//     Here's a meme for you to enjoy!`,
//     embeds: [meme],
//   };
// };

// const getWelcomeMeme = async () => {
//   /*
//     this function returns a meme.

//     TODO: change this function to return a different meme randomly everytime a new user joins.
//   */
//   return new EmbedBuilder().setImage(MEME_URL);
// };

//export default event;

export default {
  name: "messageCreate",
  async execute(message) {
    // 1. Ignore messages from bots (including this one) to avoid infinite loops
    if (message.author.bot) return;

    // 2. Check if the message is "hello" (case-insensitive)
    if (message.content.toLowerCase() === "hello") {
      
      // If you want to use the specific welcome logic you wrote earlier:
      // Since this is a message, we use message.author.id instead of member.id
      const welcomeMessage = await getWelcomeMessage(message.author.id);
      
      await message.reply(welcomeMessage);
    }
  },
};
