export const evaluateAnswer = (userAnswer, correctAnswer) => {
    const isCorrect = 
    userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

    return{
        isCorrect, 
        message: isCorrect ? "✅ Good Job!" : "❌ Better luck next time!",
    };
};
// put in correct answer with better luck next time
// if input isn't a valid letter - tell them what they can input
// where else should I do input checking?