import { CommandInteraction } from 'discord.js';

import { CLEAR_QUEUE_MESSAGE } from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { reply } from './utils/reply.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const clearQueue = async (interaction: CommandInteraction) => {
  currentQueueRef.queue = [];
  await reply(CLEAR_QUEUE_MESSAGE, interaction);
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
