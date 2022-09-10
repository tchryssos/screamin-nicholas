// eslint-disable-next-line import/extensions
import { VideoMeta } from '../../../typings/queue';
import { checkIfSpotifyOkay, spotifyApi } from './setupSpotifyConnection.js';

// START - SPOTIFY FETCH - START
const buildSpotifyVideoMeta = (
  track:
    | SpotifyApi.PlaylistTrackObject['track']
    | SpotifyApi.SingleTrackResponse
    | SpotifyApi.TrackObjectSimplified
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

export const fetchSpotifyMeta = async (spotifyUrl: string) => {
  if (checkIfSpotifyOkay()) {
    const urlChunks = spotifyUrl.split('/');
    const playlistIndex = urlChunks.indexOf('playlist');

    // If you're playing a playlist ...
    if (playlistIndex !== -1) {
      const id = urlChunks[playlistIndex + 1];
      const { body, statusCode } = (await spotifyApi?.getPlaylist(id)) || {};
      if (statusCode !== 200 || !body) {
        throw new Error('Something went wrong fetching your playlist');
      }
      return body.tracks.items.map(({ track }) => buildSpotifyVideoMeta(track));
    } else {
      const trackIndex = urlChunks.indexOf('track');
      // If you're playing a specific track...
      if (trackIndex !== -1) {
        const id = urlChunks[trackIndex + 1];
        const { body, statusCode } = (await spotifyApi?.getTrack(id)) || {};
        if (statusCode !== 200 || !body) {
          throw new Error('Something went wrong fetching your track');
        }
        return buildSpotifyVideoMeta(body);
      } else {
        const albumIndex = urlChunks.indexOf('album');
        // If you're playing an album...
        if (albumIndex !== -1) {
          const id = urlChunks[albumIndex + 1];
          const { body, statusCode } = (await spotifyApi?.getAlbum(id)) || {};
          if (statusCode !== 200 || !body) {
            throw new Error('Something went wrong fetching your album');
          }
          return body.tracks.items.map((track) => buildSpotifyVideoMeta(track));
        } else {
          throw new Error(
            'Try requesting with a playlist, album, or track url'
          );
        }
      }
    }
  } else {
    throw new Error('Something went wrong connecting to Spotify');
  }
};
// END - SPOTIFY FETCH - END
