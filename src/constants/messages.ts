// START - Command Descriptions - START
export const PLAY_DESCRIPTION = 'Play specified audio in your voice channel';
export const PLAY_URL_DESCRIPTION = 'the url you want to play';

export const STOP_DESCRIPTION = 'Stop the currently playing audio';

export const QUEUE_DESCRIPTION = 'Queue specified audio for playback';
export const QUEUE_URL_DESCRIPTION = 'the url you want to queue';

export const VIEW_QUEUE_DESCRIPTION = 'View the current track queue';

export const SKIP_DESCRIPTION = 'Skip the current track';
// END - Command Descriptions - END

// START - Audio Status Notifications - START
export const createNowPlayingMessage = (title: string) =>
  `Now playing: ${title}`;

export const createAddedSongCountToQueueMessage = (count: number) =>
  `Added ${count} songs to the queue!`;
// END - Audio Status Notifications - END

// START - Validation Messages - START
export const SERVER_VALIDATION_ERROR =
  'Please only run this command in a server.';
export const VOICE_CHANNEL_VALIDATION_ERROR =
  'Please join a voice channel before playing audio.';
export const URL_VALIDATION_ERROR = 'Please provide a URL.';
export const QUEUE_VALIDATION_ERROR = "There's nothing in the queue!";
// END - Validation Messages - END

// START - Misc - START
export const REGISTER_COMMANDS_SUCCESS =
  'Successfully registered application commands.';
// END - Misc - END
