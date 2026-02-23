export const evaluateAnswer = (userAnswer, correctAnswer, correctText) => {
    const isCorrect = 
    userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

    return{
        isCorrect, 
        message: isCorrect 
            ? `✅ Correct! **${correctAnswer}. ${correctText}**`
            : `❌ Incorrect! The correct answer was **${correctAnswer}. ${correctText}**`,
    };
};