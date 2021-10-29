import { CommandInteraction } from 'discord.js';
import shuffle from 'lodash.shuffle';

import {
  createViewQueueMessage,
  SHUFFLE_QUEUE_MESSAGE,
} from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { reply } from './utils/reply.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const shuffleQueue = async (interaction: CommandInteraction) => {
  currentQueueRef.queue = shuffle(currentQueueRef.queue);
  return await reply(
    `${SHUFFLE_QUEUE_MESSAGE}\n${createViewQueueMessage(
      currentQueueRef.queue
    )}`,
    interaction
  );
};

export const shuffleQueueResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    {
      shouldHaveQueue: { validate: true },
      shouldBeInVoice: { validate: true },
    },
    shuffleQueue
  );
