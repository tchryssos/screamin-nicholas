import { CommandInteraction } from 'discord.js';

import {
  BANLIST_FETCH_ERROR,
  createBanlistMessage,
  DISCORD_INFO_FETCH_ERROR,
  NO_BANLIST_ERROR,
} from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
// eslint-disable-next-line import/extensions
import { InteractionData } from '../typings/validations';
import { validationsWrapper } from './utils/validationsWrapper.js';

const viewBanlist = async (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  const { guild } = interactionData;
  const { banlist } = currentQueueRef;

  if (!guild) {
    throw new Error(DISCORD_INFO_FETCH_ERROR);
  }

  if (!banlist.length) {
    return interaction.reply(NO_BANLIST_ERROR);
  }

  try {
    const guildMembers = await guild.members.fetch({ user: banlist });
    const membersString = guildMembers.reduce(
      (string, curMember) => `${string}\n${curMember.user.username}`,
      ''
    );
    return interaction.reply(createBanlistMessage(membersString));
  } catch {
    return interaction.reply(BANLIST_FETCH_ERROR);
  }
};

export const viewBanlistResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    { isAllowedToInteract: { validate: false } },
    viewBanlist
  );
