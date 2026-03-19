import { getLeaderboard } from "../helpers/leaderboard.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === "view_leaderboard") {
        const leaderboard = getLeaderboard(interaction.guildId).slice(0, 10);

        const description = leaderboard.length
          ? leaderboard
              .map(
                (entry, index) =>
                  `**${index + 1}.** ${entry.username} - Attempt ${entry.attemptNumber} - ${entry.percent.toFixed(1)}% (${entry.correct}/${entry.total})`
              )
              .join("\n")
          : "No leaderboard data yet.";

        const embed = new EmbedBuilder()
          .setTitle("Trivia Leaderboard")
          .setDescription(description);

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const commands = interaction.client.commands;
    if (!commands) {
      await interaction.reply({
        content: "Bot commands are not loaded (client.commands is missing).",
        flags: 64,
      });
      return;
    }

    const command = commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        content: `Unknown command: ${interaction.commandName}`,
        flags: 64,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: "Something went wrong :(",
        });
      } else {
        await interaction.reply({
          content: "Something went wrong :(",
          flags: 64,
        });
      }
    }
  },
};

