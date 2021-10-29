import { CommandInteraction } from 'discord.js';

export const reply = async (
  message: string,
  interaction: CommandInteraction
) => {
  if (interaction.replied) {
    await interaction.channel?.send(message);
  } else if (interaction.deferred) {
    await interaction.editReply(message);
  } else {
    await interaction.reply(message);
  }
};
