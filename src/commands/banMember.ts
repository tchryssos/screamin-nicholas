import { CommandInteraction, GuildMember } from 'discord.js';

import { MEMBER_OPTION } from '../constants/commands.js';
import {
  createBannedMessage,
  DISCORD_INFO_FETCH_ERROR,
  MENTIONEE_IS_SELF,
  MENTIONEE_ISNT_MEMBER_ERROR,
} from '../constants/messages.js';
import { currentQueueRef } from '../state/queue.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

export const banMember = (interaction: CommandInteraction) => {
  // For some reason, using object destructuring here seems to lose
  // track of what the interaction is, and I get cannot read ____ of undefined errors
  const mentionee = interaction.options.getMentionable(MEMBER_OPTION);
  if (!mentionee) {
    throw new Error(DISCORD_INFO_FETCH_ERROR);
  }
  if (!(mentionee instanceof GuildMember)) {
    return interaction.reply(MENTIONEE_ISNT_MEMBER_ERROR);
  }
  const {
    user: { id, username },
  } = mentionee as GuildMember;

  if (id === interaction.user.id) {
    return interaction.reply(MENTIONEE_IS_SELF);
  }

  if (currentQueueRef.banlist.includes(id)) {
    interaction.reply(createBannedMessage(username, 'alreadyBanned'));
  }

  currentQueueRef.banlist.push(id);
  interaction.reply(createBannedMessage(username, 'ban'));
};

export const banMemberResponder = (interaction: CommandInteraction) =>
  validationsWrapper(interaction, {}, banMember);
