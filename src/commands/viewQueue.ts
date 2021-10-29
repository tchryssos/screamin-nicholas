import { CommandInteraction } from 'discord.js';

import { createViewQueueMessage } from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { reply } from './utils/reply.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const viewQueue = async (interaction: CommandInteraction) =>
  await reply(createViewQueueMessage(currentQueueRef.queue), interaction);

export const viewQueueResponder = (interaction: CommandInteraction) => {
  validationsWrapper(
    interaction,
    {
      shouldHaveQueue: { validate: true },
      shouldBeInServer: { validate: false },
      isAllowedToInteract: { validate: false },
    },
    viewQueue
  );
};
