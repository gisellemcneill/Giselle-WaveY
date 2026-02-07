****Trivia Function Architecture****

**Activity Diagram**
  ![try 3](https://github.com/user-attachments/assets/f0f740a5-5b1e-492b-9ce3-7f30c6df477c)




  The activity diagram provided illustrates the flow of functions/commands that happen 
  inside the Discord trivia bot. This bot follows an event-driven model where the user
  enters a command, and this triggers a sequence of functions. These functions manage 
  the trivia gameplay that allows the user to interact with the bot. 

  The flow starts when the user uses the /trivia command. On the back end, it will create
  a new session and store that state in a shared session map. Using the map, the bot can 
  determine if the user is already in an active trivia session. 

  On the user end, the /trivia command will cause an introduction message, and the first question 
  to appear. Once the user enters input of either <"A, B, C, D">, the bot will check using 
  the map if there is an active trivia session. If there is, the bot then calls 
  The evaluateAnswer() function checks if the user input is the correct answer. 

  This design utilizes small, single-responsibility functions/commands that separate
  the command handling from the core logic of the game. By doing this, we can allow for 
  future features to be added. These future functions will be added in the "helpers" folder
  under "src". Helper functions used by commands or event handlers are exported through the
  "index.js" file. When new functions are added, they should be exported from this file to 
  allow accessibility by other parts of the bot. 

  The next features to be added are included in the activity diagram in grey boxes, such as: 
  a scoreboard, handling incorrect user input, exit command, and displaying more questions. 

  By, 
 
Giselle McNeill

  (02/04/2026)

Code Architecture : Aditi Menon

![Code Architecture Class Diagram](codeArch.png)


This class diagram presents the code architecture of the WaveY bot, with dependency relationships represented by dotted lines between modules to indicate how different components rely on one another at runtime. The application entry point (app.js) creates the Discord client and initializes the system by invoking helpers/index.js, which coordinates the dynamic loading of command and event modules. loadCommands.js loads command implementations such as trivia.js, while loadEvents.js registers event handlers including ready.js, messageCreate.js, and guildMemberAdd.js through the shared loadFiles.js utility. The trivia command depends on helper modules like activeTrivia.js for session management and evaluateAnswer.js for answer validation, demonstrating a modular separation between core application logic, event routing, and reusable domain functionality.


GitHub Interacting With The Bot: Jayda Fountain

<img width="2217" height="1053" alt="Discord Bot - GitHub System Context" src="https://github.com/user-attachments/assets/bb90ca00-9de8-44a5-83d1-08d96e40ec19" />

This system context diagram helps to display the relationship of how GitHub interacts with the WaveY Trivia Bot on Discord. We start at the Discord bot which is run in GitHub codespaces where it can pull/push code to update through the GitHub source repo. This codespace not only has access to secrets such as the token id and other identifiers located in the .env file, but it also calls the Discord API. This and the Discord platform exposing the API allows the bot to actually perform interactions such as sending messages by using the secrets to authenticate the API. Our bot is manually hosted meaning that the developer must use npm run commands to start up/make the bot online within the GitHub codespace. Once the bot is online, the Discord platform can forward events to the bot such as commands that trigger the bot to respond. Through this same procedure, the developer can end the command, essentially turning off the bot. Thus, if the codespace stops while the bot is on, the whole process is terminated since each component relies on one another.



**Use Case Diagram: Audrey Simonnet**

![Use Case Diagram](audrey_arch_diagram.png)

This use case diagram models the core interactions between a Discord user and the Trivia Bot system. It identifies the primary functionalities available to the user and distinguishes between current functionality (in yellow) and planned future enhancements (in gray).

The user can currently start a trivia session, and submit answers to questions. When trivia begins, the system displays a welcome message with instructions and the first question. The user's submitted answer is evaluated by the system, which then provides feedback indicating whether the answer is correct or incorrect.

Future functionality is modeled using UML relationships to distinguish between required and optional system behavior. Displaying the correct answer after an incorrect user answer and answering a newly displayed question are represented using `<<extend>>`. In contrast, exiting the trivia and displaying the final score summary are modeled without the `<<extend>>`, since the score summary is always displayed whenever the trivia session ends and therefore represents required system behavior.