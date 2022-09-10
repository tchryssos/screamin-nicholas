import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
} from 'discord.js';

import { MEMBER_OPTION } from '../constants/commands.js';
import {
  createBannedMessage,
  DISCORD_INFO_FETCH_ERROR,
  MENTIONEE_IS_SELF,
  MENTIONEE_ISNT_MEMBER_ERROR,
} from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { reply } from './utils/reply.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

export const banMember = async (interaction: CommandInteraction) => {
  // For some reason, using object destructuring here seems to lose
  // track of what the interaction is, and I get cannot read ____ of undefined errors
  const mentionee = (
    interaction.options as CommandInteractionOptionResolver
  ).getMentionable(MEMBER_OPTION);
  if (!mentionee) {
    throw new Error(DISCORD_INFO_FETCH_ERROR);
  }
  if (!(mentionee instanceof GuildMember)) {
    return await reply(MENTIONEE_ISNT_MEMBER_ERROR, interaction);
  }
  const {
    user: { id, username },
  } = mentionee as GuildMember;

  if (id === interaction.user.id) {
    return await reply(MENTIONEE_IS_SELF, interaction);
  }

  if (currentQueueRef.banlist.includes(id)) {
    return await reply(
      createBannedMessage(username, 'alreadyBanned'),
      interaction
    );
  }

  currentQueueRef.banlist.push(id);
  return await reply(createBannedMessage(username, 'ban'), interaction);
};

export const banMemberResponder = (interaction: CommandInteraction) =>
  validationsWrapper(interaction, {}, banMember);
