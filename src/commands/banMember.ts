import { CommandInteraction } from 'discord.js';

import { validationsWrapper } from './utils/validationsWrapper.js';

export const banMember = () => null;

export const banMemberResponder = (interaction: CommandInteraction) =>
  validationsWrapper(interaction, {}, banMember);
