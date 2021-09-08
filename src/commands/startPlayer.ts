import { CommandInteraction } from 'discord.js';
import { InteractionData } from 'src/typings/validations.js';

import { currentQueueRef } from '../state/queue.js';
import { fetchMeta, fetchStream } from './utils/fetchYoutube.js';
import { playAudio } from './utils/playAudio.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

// This function (and its utils) adapted from https://discordjs.guide/popular-topics/faq.html#how-do-i-play-music-from-youtube
export const startPlayer = async (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  const { url, voiceChannel, guild } = interactionData;
  try {
    if (!url || !voiceChannel || !guild) {
      throw new Error('Something went wrong fetching your info from discord.');
    }

    const stream = await fetchStream(url);
    const meta = await fetchMeta(url);
    currentQueueRef.current = {
      stream,
      meta,
    };

    playAudio(interaction, stream, voiceChannel.id, guild!);
  } catch (e) {
    const { message } = e as Error;
    interaction.reply(message);
  }
};

export const startPlayerResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    {
      shouldBeInVoice: { validate: true },
      shouldHaveUrl: { validate: true },
    },
    startPlayer
  );
