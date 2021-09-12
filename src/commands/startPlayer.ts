import { CommandInteraction } from 'discord.js';

import { URL_OPTION } from '../constants/commands.js';
import { DISCORD_INFO_FETCH_ERROR } from '../constants/messages.js';
import { YOUTUBE_PLAYLIST_REGEX } from '../constants/regex.js';
import { currentQueueRef } from '../state/queue.js';
import { InteractionData } from '../typings/validations.js';
import { fetchMeta, fetchStream } from './utils/fetchYoutube.js';
import { playAudio } from './utils/playAudio.js';
import { playNextTrack } from './utils/playNextTrack.js';
import { queuePlaylist } from './utils/queuePlaylist.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

// This function (and its utils) adapted from https://discordjs.guide/popular-topics/faq.html#how-do-i-play-music-from-youtube
export const startPlayer = async (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  const { voiceChannel, guild } = interactionData;
  const {
    options: { getString },
  } = interaction;
  const url = getString(URL_OPTION);
  try {
    if (!url || !voiceChannel || !guild) {
      throw new Error(DISCORD_INFO_FETCH_ERROR);
    }

    const isPlaylist = YOUTUBE_PLAYLIST_REGEX.test(url);
    if (isPlaylist) {
      currentQueueRef.queue = [];
      await queuePlaylist(url, interaction, async () =>
        playNextTrack(interaction, voiceChannel.id, guild, true)
      );
    } else {
      const stream = await fetchStream(url);
      const meta = await fetchMeta(url);
      currentQueueRef.current = {
        stream,
        meta,
      };

      playAudio(interaction, stream, voiceChannel.id, guild!);
    }
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
    },
    startPlayer
  );
