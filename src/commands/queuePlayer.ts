import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';
// eslint-disable-next-line import/extensions
import { InteractionData } from '../typings/validations';
import { fetchMeta, fetchStream } from './utils/fetchYoutube.js';
import { playAudio } from './utils/playAudio.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

export const queuePlayer = async (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { url, voiceChannel, guild } = interactionData;
  try {
    if (!url || !voiceChannel || !guild) {
      throw new Error('Something went wrong fetching your info from Discord');
    }
    const meta = await fetchMeta(url);
    if (!currentQueueRef.current) {
      const stream = await fetchStream(url);
      currentQueueRef.current = {
        meta,
        stream,
      };
      playAudio(interaction, stream, voiceChannel.id, guild);
    } else {
      currentQueueRef.queue.push(meta);
      interaction.reply(
        `Added "${meta.title}" to the queue. It's #${currentQueueRef.queue.length} in the queue.`
      );
    }
  } catch (e) {
    const { message } = e as Error;
    interaction.reply(message);
  }
};

export const queuePlayerResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    { shouldBeInVoice: { validate: true }, shouldHaveUrl: { validate: true } },
    queuePlayer
  );
