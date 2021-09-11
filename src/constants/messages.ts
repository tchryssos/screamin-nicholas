// eslint-disable-next-line import/extensions
import { VideoMeta } from '../typings/queue';

// START - Command Descriptions - START
export const PLAY_DESCRIPTION = 'Play specified audio in your voice channel';
export const PLAY_URL_DESCRIPTION = 'the url you want to play';

export const STOP_DESCRIPTION = 'Stop the currently playing audio';

export const QUEUE_DESCRIPTION = 'Queue specified audio for playback';
export const QUEUE_URL_DESCRIPTION = 'the url you want to queue';

export const VIEW_QUEUE_DESCRIPTION = 'View the current track queue';

export const SKIP_DESCRIPTION = 'Skip the current track';
// END - Command Descriptions - END

// START - Validation Messages - START
export const SERVER_VALIDATION_ERROR =
  'Please only run this command in a server.';
export const VOICE_CHANNEL_VALIDATION_ERROR =
  'Please join a voice channel before playing audio.';
export const URL_VALIDATION_ERROR = 'Please provide a URL.';
export const QUEUE_VALIDATION_ERROR = "There's nothing in the queue!";
export const DISCORD_INFO_FETCH_ERROR =
  'Something went wrong fetching your info from Discord';
export const SHOULD_BE_PLAYING_VALIDATION_ERROR =
  'Nothing is currently playing';
// END - Validation Messages - END

// START - Audio Status - START
export const STOPPING_MESSAGE = 'Stopping player';
// END - Audio Status - END

// START - Misc - START
export const REGISTER_COMMANDS_SUCCESS =
  'Successfully registered application commands.';
// END - Misc - END

// START - Functions - START
// These are not constants, but it makes more sense to put
// these functions here than anywhere else

// Audio Status
export const createNowPlayingMessage = (title: string) =>
  `Now playing: ${title}`;

export const createAddedSongCountToQueueMessage = (count: number) =>
  `Added ${count} songs to the queue!`;
export const createAddedSongToQueueMessage = (
  title: string,
  queuePosition: number
) => `Added "${title}" to the queue. It's #${queuePosition} in the queue.`;

const queueDisplayLimit = 10;
const positionSpaces = {
  1: 3,
  2: 2,
  3: 1,
};

export const createViewQueueMessage = (queue: VideoMeta[]) => {
  const trackList = queue
    .slice(0, queueDisplayLimit)
    .reduce((listString, currentMeta, i) => {
      return `${listString}\n#${i + 1}:${' '.repeat(
        positionSpaces[(i + 1).toString().length]
      )}${currentMeta.title}`;
    }, '');

  return `Here are the ${
    queue.length > queueDisplayLimit ? `next ${queueDisplayLimit} ` : ''
  }tracks in the queue:\n${trackList}\n\nThere are ${
    queue.length
  } songs in the queue.`;
};
// END - Functions - END
