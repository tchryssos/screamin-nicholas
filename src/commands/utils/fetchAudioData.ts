import { CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import ytdl from 'ytdl-core';

import { createAddedSongCountToQueueMessage } from '../../constants/messages.js';
import { currentQueueRef } from '../../state/queue.js';
// eslint-disable-next-line import/extensions
import { VideoMeta } from '../../typings/queue';
import { reply } from './reply.js';
import { fetchSpotifyMeta } from './spotify/fetch.js';
import { connectToSpotify } from './spotify/setupSpotifyConnection.js';
import { fetchStream, fetchYoutubeTopResultStream } from './youtube/fetch.js';

dotenv.config();

connectToSpotify();

export const tryFetchStream = async (
  searchText: string,
  interaction: CommandInteraction
) => {
  if (!interaction.deferred) {
    await interaction.deferReply();
  }
  let stream: ReturnType<typeof ytdl>;
  let url: string;
  let meta: VideoMeta | undefined;

  // If is Youtube URL
  if (ytdl.validateURL(searchText)) {
    stream = await fetchStream(searchText);
    url = searchText;
    meta = undefined;
  } else if (searchText.includes('spotify')) {
    // If is Spotify URL
    const spotifyMetaArrayOrObj = await fetchSpotifyMeta(searchText);
    let primaryMeta: VideoMeta;
    if (Array.isArray(spotifyMetaArrayOrObj)) {
      if (spotifyMetaArrayOrObj.length > 1) {
        const queue = spotifyMetaArrayOrObj.slice(1);
        currentQueueRef.queue = queue;
        reply(
          `${createAddedSongCountToQueueMessage(
            queue.length
          )}. Loading first track...`,
          interaction
        );
      }
      primaryMeta = spotifyMetaArrayOrObj[0];
    } else {
      primaryMeta = spotifyMetaArrayOrObj;
    }
    const { author, title } = primaryMeta;
    const { stream: searchedStream, meta: searchedMeta } =
      await fetchYoutubeTopResultStream(`${title} by ${author}`);
    url = searchedMeta.url;
    stream = searchedStream;
    meta = searchedMeta;
  } else {
    // Else, Search Youtube
    const { stream: searchedStream, meta: searchedMeta } =
      await fetchYoutubeTopResultStream(searchText);
    url = searchedMeta.url;
    stream = searchedStream;
    meta = searchedMeta;
  }
  return { stream, url, meta };
};
