import { CommandInteraction } from 'discord.js';

import { CLEAR_QUEUE_MESSAGE } from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const clearQueue = (interaction: CommandInteraction) => {
  currentQueueRef.queue = [];
  interaction.reply(CLEAR_QUEUE_MESSAGE);
};

export const clearQueueResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    {
      shouldBeInVoice: { validate: true },
      shouldHaveQueue: { validate: true },
    },
    clearQueue
  );
