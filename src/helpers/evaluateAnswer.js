export const evaluateAnswer = (userAnswer, correctAnswer) => {
    const isCorrect = 
    userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

    return{
        isCorrect, 
        message: isCorrect ? "✅ Good Job!" : "❌ Better luck next time!",
    };
};
