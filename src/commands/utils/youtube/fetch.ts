import ytdl from 'ytdl-core';
import ytsr, { Video } from 'ytsr';

// eslint-disable-next-line import/extensions
import { VideoMeta, YTDLStream } from '../../../typings/queue';
import { durationToSeconds } from '../../../utils/durationToSeconds.js';

// START - YOUTUBE STREAM FETCH - START
export const fetchStream = async (youtubeUrl: string) =>
  ytdl(youtubeUrl, {
    filter: 'audioonly',
    dlChunkSize: 0,
    // See https://github.com/fent/node-ytdl-core/issues/902#issuecomment-881863309
    // and https://github.com/fent/node-ytdl-core/issues/405#issuecomment-456100321
    // This prevents stream errors after 3-4 songs of listening
    highWaterMark: 1 << 25,
  });
// END - YOUTUBE STREAM FETCH - END

// START - YOUTUBE META FETCH - START
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
// END - YOUTUBE META FETCH - END

// START - YOUTUBE SEARCH - START
export const fetchYoutubeSearchTopResultMeta = async (
  searchText: string
): Promise<VideoMeta> => {
  const searchResults = await ytsr(searchText);
  if (searchResults.results) {
    const firstResult = searchResults.items.find(
      (result) => result.type === 'video'
    );
    if (firstResult) {
      const { url, title, author, duration } = firstResult as Video;
      const meta: VideoMeta = {
        title,
        url,
        author: author?.name || 'Unknown',
        lengthSeconds: durationToSeconds(duration),
      };
      return meta;
    }
  }
  throw new Error(`No results found for ${searchText}`);
};

export const fetchYoutubeTopResultStream = async (
  searchText: string
): Promise<{ stream: YTDLStream; meta: VideoMeta }> => {
  const meta = await fetchYoutubeSearchTopResultMeta(searchText);
  // We can be sure that meta exists because if it doesn't the above fn will throw
  const stream = await fetchStream(meta!.url);
  return { stream, meta: meta! };
};
// END - YOUTUBE SEARCH - END
