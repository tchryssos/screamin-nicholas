import { Guild, StageChannel, VoiceChannel } from 'discord.js';

type ValidationFields = {
  validate: boolean;
  customError?: string;
};

export type ValidationObj = {
  shouldBeInServer?: ValidationFields;
  shouldBeInVoice?: ValidationFields;
  shouldHaveUrl?: ValidationFields;
  shouldHaveQueue?: ValidationFields;
  shouldBePlaying?: ValidationFields;
  isAllowedToInteract?: ValidationFields;
};

export type InteractionData = {
  url: string | null;
  voiceChannel: VoiceChannel | StageChannel | null;
  guild: Guild | null;
};
