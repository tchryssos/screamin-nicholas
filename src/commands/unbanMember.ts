import { CommandInteraction, GuildMember } from 'discord.js';

import { MEMBER_OPTION } from '../constants/commands.js';
import {
  createBannedMessage,
  DISCORD_INFO_FETCH_ERROR,
  MENTIONEE_ISNT_MEMBER_ERROR,
} from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { reply } from './utils/reply.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

export const unbanMember = async (interaction: CommandInteraction) => {
  // For some reason, using object destructuring here seems to lose
  // track of what the interaction is, and I get cannot read ____ of undefined errors
  const mentionee = interaction.options.getMentionable(MEMBER_OPTION);
  if (!mentionee) {
    throw new Error(DISCORD_INFO_FETCH_ERROR);
  }

  if (!(mentionee instanceof GuildMember)) {
    return await reply(MENTIONEE_ISNT_MEMBER_ERROR, interaction);
  }

  const {
    user: { id, username },
  } = mentionee as GuildMember;

  const newBanList = currentQueueRef.banlist.filter(
    (bannedId) => bannedId !== id
  );

  if (newBanList.length === currentQueueRef.banlist.length) {
    return await reply(createBannedMessage(username, 'notBanned'), interaction);
  }

  currentQueueRef.banlist = newBanList;
  return await reply(createBannedMessage(username, 'unban'), interaction);
};

export const unbanMemberResponder = (interaction: CommandInteraction) =>
  validationsWrapper(interaction, {}, unbanMember);
