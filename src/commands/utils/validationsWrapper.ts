import {
  CommandInteraction,
  Guild,
  StageChannel,
  VoiceChannel,
} from 'discord.js';

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
  } = validationObj;
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { options, guildId, client } = interaction;
  let guild: Guild | null = null;
  let voiceChannel: VoiceChannel | StageChannel | null = null;

  if (shouldBeInServer?.validate) {
    if (!guildId) {
      return interaction.reply('Please only run this command in a server.');
    }

    guild = client.guilds.cache.get(guildId)!;
    const member = guild.members.cache.get(interaction.member!.user.id);

    voiceChannel = member!.voice.channel;
    if (!voiceChannel && shouldBeInVoice?.validate) {
      return interaction.reply(
        shouldBeInVoice.customError ||
          'Please join a voice channel before playing audio.'
      );
    }
  }
  const url = options.getString('url');
  if (!url && shouldHaveUrl?.validate) {
    return interaction.reply(
      shouldHaveUrl.customError || 'Please provide a URL.'
    );
  }

  const queueLength = currentQueueRef.queue.length;

  if (!queueLength && shouldHaveQueue?.validate) {
    interaction.reply(
      shouldHaveQueue.customError || "There's nothing in the queue!"
    );
  }

  return callback(interaction, { url, guild, voiceChannel });
};
