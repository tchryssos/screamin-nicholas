import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const stopPlayer = (interaction: CommandInteraction) => {
  const { player, current } = currentQueueRef;
  if (player && current) {
    player.pause();
    interaction.reply('Stopping player');
    currentQueueRef.current = null;
    currentQueueRef.queue = [];
  } else {
    interaction.reply('Nothing is playing');
  }
};

export const stopPlayerResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    {
      shouldBeInVoice: { validate: true },
    },
    stopPlayer
  );
