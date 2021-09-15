import { CommandInteraction } from 'discord.js';

import { VOLUME_OPTION } from '../constants/commands.js';
import {
  createGetVolumeMessage,
  createSetVolumeMessage,
  NO_AUDIO_RESOURCE_ERROR,
} from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const volume = (interaction: CommandInteraction) => {
  const audioResource = currentQueueRef.current.resource;
  if (!audioResource || !audioResource.volume) {
    throw new Error(NO_AUDIO_RESOURCE_ERROR);
  }
  const volumePerc = interaction.options.getInteger(VOLUME_OPTION);
  if (!volumePerc) {
    return interaction.reply(
      createGetVolumeMessage(audioResource.volume.volume)
    );
  }

  audioResource.volume?.setVolume(volumePerc / 100);
  return interaction.reply(createSetVolumeMessage(audioResource.volume.volume));
};

export const volumeResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    {
      shouldBeInVoice: { validate: true },
      shouldBePlaying: { validate: true },
    },
    volume
  );
