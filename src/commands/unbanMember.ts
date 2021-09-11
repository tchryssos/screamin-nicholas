import { CommandInteraction } from 'discord.js';

import { validationsWrapper } from './utils/validationsWrapper.js';

export const unbanMember = () => null;

export const unbanMemberResponder = (interaction: CommandInteraction) =>
  validationsWrapper(interaction, {}, unbanMember);
