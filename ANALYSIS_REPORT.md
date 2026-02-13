**Unit Testing Report:**
<img width="557" height="251" alt="Screenshot 2026-02-13 at 3 08 19 PM" src="https://github.com/user-attachments/assets/bcf1eec7-a618-4b91-83bf-e78650caf0c1" />

**Results:**

I analyzed the /trivia command used to trigger functionality and design within the Trivia Discord bot. This process involved four unit tests, stored in the tests folder and defined in trivia.spec.js, to validate 3 expected functionalities and address one weakness in the current implementation. 

**Successes:**

The first unit test recognized that the bot correctly stored the answer to the trivia question. This is a core functionality of the trivia bot: when the user enters an answer, the bot must correlate it with the correct answer to the question. Internally, this guarantees that the state of the map that holds the answer is functioning, user answers are being stored properly, and the core logic of the game is functioning. 
The second unit test examined how the bot sends a trivia question to the user when the /trivia command is invoked. This confirmed that the bot is interacting correctly with the user, responding appropriately, and that the command is being recognized and executed correctly. 
The third unit test tested the interaction lifecycle and its handling within the bot. Our bot calls deferReply() before editReply(0). Call: this is important to test because Discord requires bots to respond within 3 seconds; otherwise, it will time out. So the deferReply() call is vital to the functionality because it acknowledges the timeout immediately and says, "Hold on, I'm thinking while I grab a question." These functions passed the unit test, meaning that the bot is handling these interactions correctly. 

**Weaknesses:**

A fourth unit test was added to catch a scenario I had been wondering about after testing another bot from a different group. It was to check whether there are any restrictions on spamming the /trivia (initialization command). The test results show that the bot does not prevent users from spamming the /trivia command and can open multiple sessions, with no per-user limit or checks to prevent misuse. This weakness could be problematic, as it may cause the bot to crash or experience performance issues. 

**Overall:**

While building this bot, our team focused on functionality. So some features such as spamming, session timeout, and invalid input were all noticed throughout the testing and analyzing phase. This bot’s core functionality is working, and going forward, we will focus on adding features to support user error rather than just how it needs to run. 


By: 
Giselle McNeill 
02/13/2026


