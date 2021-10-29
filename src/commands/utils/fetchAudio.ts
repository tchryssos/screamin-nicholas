import { CommandInteraction } from 'discord.js';
import ytdl from 'ytdl-core';
import ytsr, { Video } from 'ytsr';

// eslint-disable-next-line import/extensions
import { VideoMeta } from '../../typings/queue';
import { durationToSeconds } from '../../utils/durationToSeconds.js';

export const fetchStream = async (youtubeUrl: string) =>
  ytdl(youtubeUrl, {
    filter: 'audioonly',
    dlChunkSize: 0,
    // See https://github.com/fent/node-ytdl-core/issues/902#issuecomment-881863309
    // and https://github.com/fent/node-ytdl-core/issues/405#issuecomment-456100321
    // This prevents stream errors after 3-4 songs of listening
    highWaterMark: 1 << 25,
  });

export const fetchYoutubeMeta = async (
  youtubeUrl: string
): Promise<VideoMeta> => {
  const {
    videoDetails: {
      title,
      author: { name },
      lengthSeconds,
    },
  } = await ytdl.getBasicInfo(youtubeUrl);
  return { title, author: name, lengthSeconds, url: youtubeUrl };
};

export const fetchYoutubeTopResultStream = async (searchText: string) => {
  const searchResults = await ytsr(searchText);
  if (searchResults.results) {
    const firstResult = searchResults.items.find(
      (result) => result.type === 'video'
    );
    if (firstResult) {
      const { url, title, author, duration } = firstResult as Video;
      const stream = await fetchStream(url);
      const meta: VideoMeta = {
        title,
        url,
        author: author?.name || 'Unknown',
        lengthSeconds: durationToSeconds(duration),
      };
      return { url, stream, meta };
    }
  }
  throw new Error(`No results found for ${searchText}`);
};

export const tryFetchStream = async (
  searchText: string,
  interaction: CommandInteraction
) => {
  await interaction.deferReply();
  let stream: ReturnType<typeof ytdl>;
  let url: string;
  let meta: VideoMeta | undefined;
  if (ytdl.validateURL(searchText)) {
    stream = await fetchStream(searchText);
    url = searchText;
    meta = undefined;
  } else {
    const {
      url: searchedUrl,
      stream: searchedStream,
      meta: searchedMeta,
    } = await fetchYoutubeTopResultStream(searchText);
    url = searchedUrl;
    stream = searchedStream;
    meta = searchedMeta;
  }
  return { stream, url, meta };
};
