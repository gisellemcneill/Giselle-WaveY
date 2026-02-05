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
