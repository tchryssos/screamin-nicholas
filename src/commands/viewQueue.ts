import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const queueDisplayLimit = 10;

const viewQueue = (interaction: CommandInteraction) => {
  const queue = currentQueueRef.queue;
  const trackList = queue
    .slice(0, queueDisplayLimit)
    .reduce((listString, currentMeta, i) => {
      return `${listString}\n#${i + 1}: ${currentMeta.title}`;
    }, '');

  interaction.reply(
    `Here are the ${
      queue.length > queueDisplayLimit ? `next ${queueDisplayLimit} ` : ''
    }tracks in the queue:\n${trackList}`
  );
};

export const viewQueueResponder = (interaction: CommandInteraction) => {
  validationsWrapper(
    interaction,
    {
      shouldHaveQueue: { validate: true },
      shouldBeInServer: { validate: false },
    },
    viewQueue
  );
};
