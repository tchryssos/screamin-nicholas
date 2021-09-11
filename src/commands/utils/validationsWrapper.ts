import {
  CommandInteraction,
  Guild,
  StageChannel,
  VoiceChannel,
} from 'discord.js';

import {
  CAN_INTERACT_VALIDATION_ERROR,
  QUEUE_VALIDATION_ERROR,
  SERVER_VALIDATION_ERROR,
  SHOULD_BE_PLAYING_VALIDATION_ERROR,
  URL_VALIDATION_ERROR,
  VOICE_CHANNEL_VALIDATION_ERROR,
} from '../../constants/messages.js';
import { currentQueueRef } from '../../state/queue.js';
// eslint-disable-next-line import/extensions
import { InteractionData, ValidationObj } from '../../typings/validations';

export const validationsWrapper = (
  interaction: CommandInteraction,
  validationObj: ValidationObj,
  callback: (
    interaction: CommandInteraction,
    interactionData: InteractionData
  ) => void
) => {
  const {
    shouldBeInServer = { validate: true },
    shouldBeInVoice,
    shouldHaveQueue,
    shouldHaveUrl,
    shouldBePlaying,
    isAllowedToInteract = { validate: true },
  } = validationObj;
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { options, guildId, client } = interaction;
  let guild: Guild | null = null;
  let voiceChannel: VoiceChannel | StageChannel | null = null;

  if (isAllowedToInteract?.validate) {
    if (currentQueueRef.banlist.includes(interaction.user.id)) {
      return interaction.reply(CAN_INTERACT_VALIDATION_ERROR);
    }
  }

  if (shouldBeInServer?.validate) {
    if (!guildId) {
      return interaction.reply(SERVER_VALIDATION_ERROR);
    }

    guild = client.guilds.cache.get(guildId)!;
    const member = guild.members.cache.get(interaction.member!.user.id);

    voiceChannel = member!.voice.channel;
    if (!voiceChannel && shouldBeInVoice?.validate) {
      return interaction.reply(
        shouldBeInVoice.customError || VOICE_CHANNEL_VALIDATION_ERROR
      );
    }
  }
  const url = options.getString('url');
  if (!url && shouldHaveUrl?.validate) {
    return interaction.reply(shouldHaveUrl.customError || URL_VALIDATION_ERROR);
  }

  if (!currentQueueRef.current && shouldBePlaying?.validate) {
    interaction.reply(
      shouldBePlaying.customError || SHOULD_BE_PLAYING_VALIDATION_ERROR
    );
  }

  const queueLength = currentQueueRef.queue.length;

  if (!queueLength && shouldHaveQueue?.validate) {
    interaction.reply(shouldHaveQueue.customError || QUEUE_VALIDATION_ERROR);
  }

  return callback(interaction, { url, guild, voiceChannel });
};
