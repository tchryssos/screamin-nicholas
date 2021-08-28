import ytdl from 'ytdl-core';

export const fetchStream = async (youtubeUrl: string) =>
  ytdl(youtubeUrl, { filter: 'audioonly', dlChunkSize: 0 });

export const fetchMeta = async (youtubeUrl: string) => {
  const {
    videoDetails: {
      title,
      author: { name },
      lengthSeconds,
    },
  } = await ytdl.getBasicInfo(youtubeUrl);
  return { title, author: name, lengthSeconds, url: youtubeUrl };
};
