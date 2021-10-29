import { CommandInteraction } from 'discord.js';

import { STOPPING_MESSAGE } from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { reply } from './utils/reply.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const stopPlayer = async (interaction: CommandInteraction) => {
  const { player } = currentQueueRef;
  player!.pause();
  await reply(STOPPING_MESSAGE, interaction);
  currentQueueRef.current = {};
  currentQueueRef.queue = [];
};

export const stopPlayerResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    {
      shouldBeInVoice: { validate: true },
      shouldBePlaying: { validate: true },
    },
    stopPlayer
  );
