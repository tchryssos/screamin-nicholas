import SpotifyWebApi from 'spotify-web-api-node';

// START - SPOTIFY CONFIG - START
let spotifyOk = false;
export const checkIfSpotifyOkay = () => spotifyOk;

// https://github.com/thelinmichael/spotify-web-api-node#client-credential-flow
const makeSpotifyApiClient = () => {
  try {
    const client = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    return client;
  } catch (e) {
    return undefined;
  }
};
export const spotifyApi = makeSpotifyApiClient();

export const connectToSpotify = () => {
  spotifyApi?.clientCredentialsGrant().then((data) => {
    try {
      spotifyApi.setAccessToken(data.body['access_token']);
      // eslint-disable-next-line no-console
      console.log('Successfully authenticated with Spotify');
      // eslint-disable-next-line no-console
      console.log('The access token expires in ' + data.body['expires_in']);
      spotifyOk = true;
    } catch {
      console.warn(
        'Something went wrong trying to set the Spotify access token'
      );
    }
  });
};
// END - SPOTIFY CONFIG - END
