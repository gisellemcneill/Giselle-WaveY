// Import Node's built-in assertion library
import assert from "assert";

// Import the trivia command we want to test
import trivia from "../src/commands/trivia.js";

// Import the activeTrivia Map so we can check stored values
import { activeTrivia } from "../src/helpers/activeTrivia.js";


// "describe" groups related tests together
// This creates a test suite for the trivia command
describe("Trivia Command Unit Tests", function () {

  let interaction;

  // beforeEach runs before EVERY test
  // We use it to reset state so tests don't affect each other
  beforeEach(function () {

    // Clear stored trivia state
    activeTrivia.clear();

    // Mock the Discord interaction object
    // This prevents us from needing a real Discord server
    interaction = {
      user: { id: "testUser" },

      // Fake deferReply function
      deferReply: async () => {},

      // Fake editReply function
      // We capture the message sent so we can test it
      editReply: async (msg) => {
        interaction.sentMessage = msg;
      }
    };
  });



  // TEST 1
  // Checks that the bot stores a correct answer (A–D)
  it("GOOD:stores a correct answer for the user", async function () {

    // Run the trivia command
    await trivia.execute(interaction);

    // Get what was stored in the Map
    const stored = activeTrivia.get("testUser");

    // Assert that something was stored
    assert.ok(stored);

    // Assert that the stored answer is one of A, B, C, or D
    assert.ok(["A", "B", "C", "D"].includes(stored.correctAnswer));
  });



  // TEST 2
  // Checks that a trivia question message was sent
  it("GOOD:sends a trivia question message", async function () {

    // Run the trivia command
    await trivia.execute(interaction);

    // Check that editReply was called
    assert.ok(interaction.sentMessage);

    // Check that the message contains expected text
    assert.ok(interaction.sentMessage.includes("Trivia Question"));
  });



  // TEST 3
  // Ensures deferReply() is actually called
  it("GOOD:calls deferReply before editing reply", async function () {

    let deferred = false;

    // Override deferReply to track whether it was called
    interaction.deferReply = async () => {
      deferred = true;
    };

    // Run command
    await trivia.execute(interaction);

    // Confirm deferReply was triggered
    assert.ok(deferred);
  });

  //TEST 4
  
  it("BAD:allows a user to start trivia multiple times without restriction", async function () {

  await trivia.execute(interaction);
  const first = activeTrivia.get("testUser");

  await trivia.execute(interaction);
  const second = activeTrivia.get("testUser");

  // State exists both times
  assert.ok(first);
  assert.ok(second);

});


});
