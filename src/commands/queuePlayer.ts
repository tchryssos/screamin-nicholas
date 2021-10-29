import { CommandInteraction, Guild } from 'discord.js';
import isEmpty from 'lodash.isempty';
import ytdl from 'ytdl-core';

import { QUERY_OPTION } from '../constants/commands.js';
import {
  createAddedSongCountToQueueMessage,
  createAddedSongToQueueMessage,
  DISCORD_INFO_FETCH_ERROR,
} from '../constants/messages.js';
import { YOUTUBE_PLAYLIST_REGEX } from '../constants/regex.js';
import { currentQueueRef } from '../state/queue.js';
import { VideoMeta } from '../typings/queue.js';
// eslint-disable-next-line import/extensions
import { InteractionData } from '../typings/validations';
import {
  fetchSpotifyMeta,
  fetchStream,
  fetchYoutubeMeta,
  fetchYoutubeSearchTopResultMeta,
} from './utils/fetchAudioData.js';
import { playAudio } from './utils/playAudio.js';
import { playNextTrack } from './utils/playNextTrack.js';
import { queuePlaylist } from './utils/queuePlaylist.js';
import { reply } from './utils/reply.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const fetchAndPlay = async (
  meta: VideoMeta,
  interaction: CommandInteraction,
  channelId: string,
  guild: Guild
) => {
  const stream = await fetchStream(meta.url);
  currentQueueRef.current = {
    meta,
    stream,
  };
  playAudio(interaction, stream, channelId, guild);
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
    const isYTPlaylist = YOUTUBE_PLAYLIST_REGEX.test(query);
    if (isYTPlaylist) {
      await queuePlaylist(query, interaction, async (metaArray) => {
        if (isEmpty(currentQueueRef.current)) {
          await fetchAndPlay(
            metaArray![0],
            interaction,
            voiceChannel.id,
            guild
          );
        }
      });
    } else if (query.includes('spotify')) {
      if (!interaction.deferred) {
        await interaction.deferReply();
      }
      const spotifyMetaArrayOrObj = await fetchSpotifyMeta(query);
      let queueLength = 1;
      if (Array.isArray(spotifyMetaArrayOrObj)) {
        currentQueueRef.queue = [
          ...currentQueueRef.queue,
          ...spotifyMetaArrayOrObj,
        ];
        queueLength = spotifyMetaArrayOrObj.length;
      } else {
        currentQueueRef.queue.push(spotifyMetaArrayOrObj);
      }
      reply(createAddedSongCountToQueueMessage(queueLength), interaction);
      if (isEmpty(currentQueueRef.current)) {
        reply('Now loading first track...', interaction);
        playNextTrack(
          interaction,
          interactionData.voiceChannel!.id,
          interactionData.guild!
        );
      }
    } else {
      let meta: VideoMeta;
      interaction.deferReply();
      if (ytdl.validateURL(query)) {
        meta = await fetchYoutubeMeta(query);
      } else {
        meta = await fetchYoutubeSearchTopResultMeta(query);
      }
      if (isEmpty(currentQueueRef.current)) {
        await fetchAndPlay(meta, interaction, voiceChannel.id, guild);
      } else {
        currentQueueRef.queue.push(meta);
        await reply(
          createAddedSongToQueueMessage(
            meta.title,
            currentQueueRef.queue.length
          ),
          interaction
        );
      }
    }
  } catch (e) {
    const { message } = e as Error;
    await reply(message, interaction);
  }
};

export const queuePlayerResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    { shouldBeInVoice: { validate: true } },
    queuePlayer
  );
