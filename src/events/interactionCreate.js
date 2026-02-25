export default {
  name: "interactionCreate",
  async execute(interaction) {
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
    } 
    catch (err) {
      console.error(err);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: "Something went wrong :(",
        });
      } else {
        await interaction.reply({
          content: "Something went wrong :(",
          flags: 64, // ephemeral
        });
      }
    }
  },
};

