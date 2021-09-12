import { CommandInteraction } from 'discord.js';

import { DISCORD_INFO_FETCH_ERROR } from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
// eslint-disable-next-line import/extensions
import { InteractionData } from '../typings/validations';
import { validationsWrapper } from './utils/validationsWrapper.js';

const viewBanlist = (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  const { guild } = interactionData;
  const { banlist } = currentQueueRef;

  if (!guild) {
    throw new Error(DISCORD_INFO_FETCH_ERROR);
  }

  console.log(guild.members);
};

export const viewBanlistResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    { isAllowedToInteract: { validate: false } },
    viewBanlist
  );
