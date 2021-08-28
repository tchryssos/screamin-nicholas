import ytdl from 'ytdl-core';

import { currentQueueRef } from '../state/queue.js';

export const fetchYoutube = async (youtubeUrl: string) => {
  const {
    videoDetails: { title, author, lengthSeconds },
  } = await ytdl.getBasicInfo(youtubeUrl);
  const stream = ytdl(youtubeUrl, { filter: 'audioonly', dlChunkSize: 0 });
  currentQueueRef.current = {
    stream,
    meta: {
      title,
      author: author.name,
      lengthSeconds,
    },
  };
  return stream;
};
