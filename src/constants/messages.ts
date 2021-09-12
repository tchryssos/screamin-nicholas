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
export const VIEW_BANLIST_DESCRIPTION =
  "View the current members on the Screamin' Nicholas banlist";

export const CLEAR_QUEUE_DESCRIPTION = 'Clear the current audio queue';
export const SHUFFLE_QUEUE_DESCRIPTION = 'Shuffle the current audio queue';
export const VOLUME_DESCRIPTION = 'Gets or sets the current volume';
export const VOLUME_OPTION_DESCRIPTION = 'Volume percentage. Can go above 100%';
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
export const NO_BANLIST_ERROR =
  "No one is currently banned from Screamin' Nicholas";
export const BANLIST_FETCH_ERROR =
  "Something went wrong fetching the banlist. This doesn't mean it isn't working, just that it can't currently be displayed";
export const INVALID_PLAYLIST_ERROR = 'Please provide a valid playlist';
export const NO_AUDIO_RESOURCE_ERROR =
  'The AudioResource or its volume setting is missing. Try `/play`ing something else';
// END - Validation / Error Messages - END

// START - Audio Status - START
export const STOPPING_MESSAGE =
  'Stopping the currently playing audio and clearing the queue';

export const CLEAR_QUEUE_MESSAGE = 'The queue has been cleared';
export const SHUFFLE_QUEUE_MESSAGE = 'The queue has been shuffled.';
// END - Audio Status - END

// START - Misc - START
export const REGISTER_COMMANDS_SUCCESS =
  'Successfully registered application commands';
// END - Misc - END

// START - Functions - START
// These are not constants, but it makes more sense to put
// these string-generating functions here than anywhere else
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

export const createBannedMessage = (
  username: string,
  type: 'ban' | 'alreadyBanned' | 'notBanned' | 'unban'
) => {
  let adverb: string;
  switch (type) {
    case 'alreadyBanned':
      adverb = 'already';
      break;
    case 'notBanned':
      adverb = 'not';
      break;
    case 'unban':
      adverb = 'no longer';
      break;
    default:
      adverb = 'now';
      break;
  }
  return `${username} is ${adverb} banned from using Screamin' Nicholas`;
};

export const createBanlistMessage = (usersString: string) =>
  `The following members are banned from affecting Screamin' Nicholas playback:\n${usersString}`;

export const createGetVolumeMessage = (volumeDecimal: number) => {
  const volumePerc = volumeDecimal * 100;
  return `Currently playing at ${volumePerc}% volume`;
};

export const createSetVolumeMessage = (volumeDecimal: number) => {
  const volumePerc = volumeDecimal * 100;
  return `Volume now set to ${volumePerc}%`;
};
// END - Functions - END
