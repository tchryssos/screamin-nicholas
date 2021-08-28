import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';

const queueDisplayLimit = 10;

export const viewQueue = (interaction: CommandInteraction) => {
  const { guildId } = interaction;
  if (!guildId) {
    return interaction.reply('Please only run this command in a server.');
  }

  const queueLength = currentQueueRef.queue.length;

  if (!queueLength) {
    interaction.reply("There's nothing in the queue!");
  }

  const trackList = currentQueueRef.queue
    .slice(0, queueDisplayLimit)
    .reduce((listString, currentMeta, i) => {
      return `${listString}\n#${i + 1}: ${currentMeta.title}`;
    }, '');

  interaction.reply(
    `Here are the ${
      queueLength > queueDisplayLimit ? `next ${queueDisplayLimit} ` : ''
    }tracks in the queue:\n${trackList}`
  );
};
