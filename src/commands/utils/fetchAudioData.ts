import { CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';
import ytdl from 'ytdl-core';
import ytsr, { Video } from 'ytsr';

import { createAddedSongCountToQueueMessage } from '../../constants/messages.js';
import { currentQueueRef } from '../../state/queue.js';
// eslint-disable-next-line import/extensions
import { VideoMeta, YTDLStream } from '../../typings/queue';
import { durationToSeconds } from '../../utils/durationToSeconds.js';
import { reply } from './reply.js';

dotenv.config();

// START - SPOTIFY CONFIG - START
let spotifyOk = false;
const checkIfSpotifyOkay = () => spotifyOk;

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
// END - SPOTIFY CONFIG - END

// START - SPOTIFY FETCH - START
const buildSpotifyVideoMeta = (
  track:
    | SpotifyApi.PlaylistTrackObject['track']
    | SpotifyApi.SingleTrackResponse
): VideoMeta => {
  const { duration_ms, name, artists } = track;
  const lengthSeconds = String(duration_ms * 1000);
  const author = artists.reduce((acc, currArtist, i) => {
    if (i === 0) {
      return currArtist.name;
    }
    return `${acc}, ${currArtist.name}`;
  }, '');
  return {
    author,
    lengthSeconds,
    title: name,
    needsSearch: true,
    url: '',
  };
};

const fetchSpotifyMeta = async (spotifyUrl: string) => {
  if (checkIfSpotifyOkay()) {
    const urlChunks = spotifyUrl.split('/');
    const playlistIndex = urlChunks.indexOf('playlist');
    if (playlistIndex !== -1) {
      const id = urlChunks[playlistIndex + 1];
      const { body, statusCode } = await spotifyApi.getPlaylist(id);
      if (statusCode !== 200) {
        throw new Error('Something went wrong fetching your playlist');
      }
      return body.tracks.items.map(({ track }) => buildSpotifyVideoMeta(track));
    } else {
      const trackIndex = urlChunks.indexOf('track');
      if (trackIndex !== -1) {
        const id = urlChunks[trackIndex + 1];
        const { body, statusCode } = await spotifyApi.getTrack(id);
        if (statusCode !== 200) {
          throw new Error('Something went wrong fetching your track');
        }
        return buildSpotifyVideoMeta(body);
      } else {
        throw new Error('Try requesting with a playlist or track url');
      }
    }
  } else {
    throw new Error('Something went wrong connecting to Spotify');
  }
};
// END - SPOTIFY FETCH - END

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

export const tryFetchStream = async (
  searchText: string,
  interaction: CommandInteraction
) => {
  await interaction.deferReply();
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
        reply(createAddedSongCountToQueueMessage(queue.length), interaction);
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
