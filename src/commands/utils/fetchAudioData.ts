import { CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import ytdl from 'ytdl-core';

// eslint-disable-next-line import/extensions
import { VideoMeta } from '../../typings/queue';
import { fetchStream, fetchYoutubeTopResultStream } from './youtube/fetch.js';

dotenv.config();

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
