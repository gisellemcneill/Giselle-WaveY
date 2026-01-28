const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Start the trivia game"),

    async execute(interaction) {
        await interaction.reply({
            content: "**Trivia is starting!** Get ready for the first question!",
        });
    },
};