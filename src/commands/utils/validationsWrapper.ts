import {
  CommandInteraction,
  Guild,
  StageChannel,
  VoiceChannel,
} from 'discord.js';
import isEmpty from 'lodash.isempty';

import {
  CAN_INTERACT_VALIDATION_ERROR,
  QUEUE_VALIDATION_ERROR,
  SERVER_VALIDATION_ERROR,
  SHOULD_BE_PLAYING_VALIDATION_ERROR,
  VOICE_CHANNEL_VALIDATION_ERROR,
} from '../../constants/messages.js';
import { currentQueueRef } from '../../state/queue.js';
// eslint-disable-next-line import/extensions
import { InteractionData, ValidationObj } from '../../typings/validations';

export const validationsWrapper = async (
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
    shouldBePlaying,
    isAllowedToInteract = { validate: true },
  } = validationObj;
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { guildId, client } = interaction;
  let guild: Guild | null = null;
  let voiceChannel: VoiceChannel | StageChannel | null = null;

  if (isAllowedToInteract?.validate) {
    if (currentQueueRef.banlist.includes(interaction.user.id)) {
      return await interaction.reply(CAN_INTERACT_VALIDATION_ERROR);
    }
  }

  if (shouldBeInServer?.validate) {
    if (!guildId) {
      return await interaction.reply(SERVER_VALIDATION_ERROR);
    }

    guild = client.guilds.cache.get(guildId)!;
    const member = guild.members.cache.get(interaction.member!.user.id);

    voiceChannel = member!.voice.channel;
    if (!voiceChannel && shouldBeInVoice?.validate) {
      return await interaction.reply(
        shouldBeInVoice.customError || VOICE_CHANNEL_VALIDATION_ERROR
      );
    }
  }

  if (isEmpty(currentQueueRef.current) && shouldBePlaying?.validate) {
    return await interaction.reply(
      shouldBePlaying.customError || SHOULD_BE_PLAYING_VALIDATION_ERROR
    );
  }

  const queueLength = currentQueueRef.queue.length;

  if (!queueLength && shouldHaveQueue?.validate) {
    return await interaction.reply(
      shouldHaveQueue.customError || QUEUE_VALIDATION_ERROR
    );
  }

  return callback(interaction, { guild, voiceChannel });
};
