import { CommandInteraction, Guild } from 'discord.js';
import isEmpty from 'lodash.isempty';
import ytdl from 'ytdl-core';

import { QUERY_OPTION } from '../constants/commands.js';
import {
  createAddedSongToQueueMessage,
  DISCORD_INFO_FETCH_ERROR,
} from '../constants/messages.js';
import { YOUTUBE_PLAYLIST_REGEX } from '../constants/regex.js';
import { currentQueueRef } from '../state/queue.js';
import { VideoMeta } from '../typings/queue.js';
// eslint-disable-next-line import/extensions
import { InteractionData } from '../typings/validations';
import {
  fetchStream,
  fetchYoutubeMeta,
  fetchYoutubeSearchTopResultMeta,
} from './utils/fetchAudioData.js';
import { playAudio } from './utils/playAudio.js';
import { queuePlaylist } from './utils/queuePlaylist.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const fetchAndPlay = async (
  meta: VideoMeta,
  interaction: CommandInteraction,
  channelId: string,
  guild: Guild,
  hasAlreadyReplied: boolean
) => {
  const stream = await fetchStream(meta.url);
  currentQueueRef.current = {
    meta,
    stream,
  };
  playAudio(interaction, stream, channelId, guild, hasAlreadyReplied);
};

export const queuePlayer = async (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { voiceChannel, guild } = interactionData;
  const query = interaction.options.getString(QUERY_OPTION);
  try {
    if (!query || !voiceChannel || !guild) {
      throw new Error(DISCORD_INFO_FETCH_ERROR);
    }
    interaction.deferReply();
    const isPlaylist = YOUTUBE_PLAYLIST_REGEX.test(query);
    if (isPlaylist) {
      await queuePlaylist(query, interaction, async (metaArray) => {
        if (isEmpty(currentQueueRef.current)) {
          await fetchAndPlay(
            metaArray![0],
            interaction,
            voiceChannel.id,
            guild,
            true
          );
        }
      });
    } else {
      let meta: VideoMeta;
      if (ytdl.validateURL(query)) {
        meta = await fetchYoutubeMeta(query);
      } else {
        meta = await fetchYoutubeSearchTopResultMeta(query);
      }
      if (isEmpty(currentQueueRef.current)) {
        await fetchAndPlay(meta, interaction, voiceChannel.id, guild, false);
      } else {
        currentQueueRef.queue.push(meta);
        interaction.editReply(
          createAddedSongToQueueMessage(
            meta.title,
            currentQueueRef.queue.length
          )
        );
      }
    }
  } catch (e) {
    const { message } = e as Error;
    interaction.editReply(message);
  }
};

export const queuePlayerResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    { shouldBeInVoice: { validate: true } },
    queuePlayer
  );
