import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Start a trivia game!"),
  async execute(interaction) {
    await interaction.reply("Trivia game started! 🎉");
  }
};