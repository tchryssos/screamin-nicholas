import { CommandInteraction } from 'discord.js';

import { createViewQueueMessage } from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const viewQueue = (interaction: CommandInteraction) =>
  interaction.reply(createViewQueueMessage(currentQueueRef.queue));

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
