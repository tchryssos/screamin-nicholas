// eslint-disable-next-line import/extensions
import { VideoMeta } from '../typings/queue';

// START - Command Descriptions - START
const createUrlDescriptionString = (verb: string) =>
  `The url of the audio you want to ${verb}`;
export const PLAY_DESCRIPTION = 'Play specified audio in your voice channel';
export const PLAY_URL_DESCRIPTION = createUrlDescriptionString('play');

export const STOP_DESCRIPTION =
  'Stop the currently playing audio and clear the current queue';

export const QUEUE_DESCRIPTION = 'Add audio to the queue';
export const QUEUE_URL_DESCRIPTION = createUrlDescriptionString('queue');

export const VIEW_QUEUE_DESCRIPTION = 'View the current audio queue';

export const SKIP_DESCRIPTION = 'Skip the currently playing audio';

export const BAN_DESCRIPTION =
  'Ban a server member from controlling playback for the duration of this session';
export const BAN_MEMBER_DESCRIPTION = 'Member to ban';
export const UNBAN_DESCRIPTION =
  'Unban a server member from controlling playback';
export const UNBAN_MEMBER_DESCRIPTION = 'Member to unban';
// END - Command Descriptions - END

// START - Validation / Error Messages - START
export const SERVER_VALIDATION_ERROR =
  'You can only run this command from inside a server';
export const VOICE_CHANNEL_VALIDATION_ERROR =
  'Please join a voice channel before trying to play audio';
export const URL_VALIDATION_ERROR = 'Please provide a URL';
export const QUEUE_VALIDATION_ERROR = "There's nothing in the queue";
export const DISCORD_INFO_FETCH_ERROR =
  'Something went wrong fetching your info from Discord';
export const SHOULD_BE_PLAYING_VALIDATION_ERROR =
  'Nothing is currently playing';
export const GENERAL_ERROR_MESSAGE = 'Something went wrong';
export const CAN_INTERACT_VALIDATION_ERROR = 'You are not allowed to do that';
export const MENTIONEE_ISNT_MEMBER_ERROR =
  "The user you mentioned isn't part of this Server. Please try again with a Server member";
export const MENTIONEE_IS_SELF = 'You cannot ban yourself';
// END - Validation / Error Messages - END

// START - Audio Status - START
export const STOPPING_MESSAGE =
  'Stopping the currently playing audio and clearing the queue';
// END - Audio Status - END

// START - Misc - START
export const REGISTER_COMMANDS_SUCCESS =
  'Successfully registered application commands';
// END - Misc - END

// START - Functions - START
// These are not constants, but it makes more sense to put
// these string-generating functions here than anywhere else

// Audio Status
export const createNowPlayingMessage = (title: string) =>
  `Now playing: ${title}`;

export const createAddedSongCountToQueueMessage = (count: number) =>
  `Added ${count} songs to the queue`;
export const createAddedSongToQueueMessage = (
  title: string,
  queuePosition: number
) => `Added "${title}" to the queue. It's #${queuePosition} in the queue`;

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

export const createBannedMessage = (username: string, isNew = true) =>
  `${username} is ${isNew ? 'now' : 'already'} banned`;
// END - Functions - END
