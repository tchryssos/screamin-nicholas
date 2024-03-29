import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';

import { QUERY_OPTION } from '../constants/commands.js';
import { DISCORD_INFO_FETCH_ERROR } from '../constants/messages.js';
import { YOUTUBE_PLAYLIST_REGEX } from '../constants/regex.js';
import { currentQueueRef } from '../state/queue.js';
import { InteractionData } from '../typings/validations.js';
import { tryFetchStream } from './utils/fetchAudioData.js';
import { playAudio } from './utils/playAudio.js';
import { playNextTrack } from './utils/playNextTrack.js';
import { queuePlaylist } from './utils/queuePlaylist.js';
import { reply } from './utils/reply.js';
import { validationsWrapper } from './utils/validationsWrapper.js';
import { fetchYoutubeMeta } from './utils/youtube/fetch.js';

// This function (and its utils) adapted from https://discordjs.guide/popular-topics/faq.html#how-do-i-play-music-from-youtube
export const startPlayer = async (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  const { voiceChannel, guild } = interactionData;
  const url = (
    interaction.options as CommandInteractionOptionResolver
  ).getString(QUERY_OPTION);
  try {
    if (!url || !voiceChannel || !guild) {
      throw new Error(DISCORD_INFO_FETCH_ERROR);
    }

    const isPlaylist = YOUTUBE_PLAYLIST_REGEX.test(url);
    if (isPlaylist) {
      currentQueueRef.queue = [];
      await queuePlaylist(url, interaction, async () =>
        playNextTrack(interaction, voiceChannel.id, guild)
      );
    } else {
      const {
        stream,
        url: youtubeUrl,
        meta: youtubeMeta,
      } = await tryFetchStream(url, interaction);
      let meta = youtubeMeta;
      if (!meta) {
        meta = await fetchYoutubeMeta(youtubeUrl);
      }
      currentQueueRef.current = {
        stream,
        meta,
      };

      playAudio(interaction, stream, voiceChannel.id, guild!);
    }
  } catch (e) {
    const { message } = e as Error;
    await reply(message, interaction);
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
