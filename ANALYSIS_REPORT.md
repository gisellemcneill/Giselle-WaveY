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

![Test coverage](testcoverage.jpg)



** Test Coverage Analysis (c8 + Mocha) : By Aditi Menon**

To evaluate how thoroughly our automated test suite exercises the WaveY codebase, we ran test coverage using the c8 coverage tool integrated with Mocha. This analysis measured the percentage of executed statements, branches, functions, and lines across all source files in the src directory.

Overall, the project achieved 16.88% statement and line coverage, 27.77% branch coverage, and 7.14% function coverage, indicating that the current tests focus primarily on specific core functionality rather than the entire system. The highest coverage occurred within the trivia feature, where src/commands/trivia.js and src/helpers/activeTrivia.js both reached 100% coverage across all metrics. This confirms that the trivia command workflow and internal trivia state management are fully exercised by the unit tests, which aligns with the work done by Giselle.

However, several major components showed 0% coverage, including the bot startup logic (app.js), all event handlers (interactionCreate.js, messageCreate.js, guildMemberAdd.js, and ready.js), and most helper utilities such as evaluateAnswer.js and command loaders. These areas were not triggered by the current unit tests, which explains the lower overall coverage percentages.

This coverage distribution reflects a common testing pattern in early development: focused validation of primary features while system-level and event-driven components remain untested. Going forward, coverage could be improved by adding targeted tests for event handlers and helper functions, as well as lightweight mocks to simulate Discord interactions. Expanding test breadth in these areas would increase confidence in system reliability and reduce the risk of runtime errors during real user interactions.

