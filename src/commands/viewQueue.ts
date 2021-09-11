import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const queueDisplayLimit = 10;

const positionSpaces = {
  1: 3,
  2: 2,
  3: 1,
};

const viewQueue = (interaction: CommandInteraction) => {
  const queue = currentQueueRef.queue;
  const trackList = queue
    .slice(0, queueDisplayLimit)
    .reduce((listString, currentMeta, i) => {
      return `${listString}\n#${i + 1}:${' '.repeat(
        positionSpaces[(i + 1).toString().length]
      )}${currentMeta.title}`;
    }, '');

  interaction.reply(
    `Here are the ${
      queue.length > queueDisplayLimit ? `next ${queueDisplayLimit} ` : ''
    }tracks in the queue:\n${trackList}\n\nThere are ${
      queue.length
    } songs in the queue.`
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
