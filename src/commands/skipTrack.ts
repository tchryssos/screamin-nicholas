import { CommandInteraction } from 'discord.js';

// eslint-disable-next-line import/extensions
import { InteractionData } from '../typings/validations';
import { playNextTrack } from './utils/playNextTrack.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

export const skipTrack = (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  const { voiceChannel, guild } = interactionData;
  playNextTrack(interaction, voiceChannel!.id, guild!, false);
};

export const skipTrackResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    { shouldBeInVoice: { validate: true } },
    skipTrack
  );
