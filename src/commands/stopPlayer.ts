import { CommandInteraction } from 'discord.js';

import { STOPPING_MESSAGE } from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const stopPlayer = (interaction: CommandInteraction) => {
  const { player } = currentQueueRef;
  player!.pause();
  interaction.reply(STOPPING_MESSAGE);
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
