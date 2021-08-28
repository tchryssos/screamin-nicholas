import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';

export const stopPlayer = (interaction: CommandInteraction) => {
  const { player } = currentQueueRef;
  if (player) {
    player.pause();
    interaction.reply('Stopping player');
    currentQueueRef.current = null;
  } else {
    interaction.reply('Nothing is playing');
  }
};
