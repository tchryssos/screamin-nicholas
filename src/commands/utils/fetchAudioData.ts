import { CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';
import ytdl from 'ytdl-core';
import ytsr, { Video } from 'ytsr';

// eslint-disable-next-line import/extensions
import { VideoMeta, YTDLStream } from '../../typings/queue';
import { durationToSeconds } from '../../utils/durationToSeconds.js';

dotenv.config();
let spotifyOk = false;
const checkIfSpotifyOkay = () => spotifyOk;

// START - SPOTIFY CONFIG - START
// https://github.com/thelinmichael/spotify-web-api-node#client-credential-flow
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

spotifyApi.clientCredentialsGrant().then((data) => {
  try {
    spotifyApi.setAccessToken(data.body['access_token']);
    // eslint-disable-next-line no-console
    console.log('Successfully authenticated with Spotify');
    spotifyOk = true;
  } catch {
    console.warn('Something went wrong trying to set the Spotify access token');
  }
});

const testPlaylist = async () => {
  try {
    const resp = await spotifyApi.getPlaylist(
      '7GQ0qcoHvGOqbKHVw73q4y?si=108bcf85426c4c07'
    );
    console.log(resp.body.tracks.items);
  } catch (e) {
    console.log('SPOTIFY ERROR: ', JSON.stringify(e));
  }
};
// END - SPOTIFY CONFIG - END

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

export const tryFetchStream = async (
  searchText: string,
  interaction: CommandInteraction
) => {
  await interaction.deferReply();
  let stream: ReturnType<typeof ytdl>;
  let url: string;
  let meta: VideoMeta | undefined;
  await testPlaylist();
  if (ytdl.validateURL(searchText)) {
    stream = await fetchStream(searchText);
    url = searchText;
    meta = undefined;
  }
  // else if (searchText.includes('spotify') && checkIfSpotifyOkay()) {
  //   try {
  //     const playlist = await spotifyApi.getPlaylist(
  //       'https://open.spotify.com/playlist/7GQ0qcoHvGOqbKHVw73q4y?si=172749d34d0c4769'
  //     );
  //     console.log('spotify: ', JSON.stringify(playlist));
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   url = '';
  //   stream = {} as YTDLStream;
  //   meta = {} as VideoMeta;
  // }
  else {
    const { stream: searchedStream, meta: searchedMeta } =
      await fetchYoutubeTopResultStream(searchText);
    url = searchedMeta.url;
    stream = searchedStream;
    meta = searchedMeta;
  }
  return { stream, url, meta };
};
