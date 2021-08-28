import { AudioPlayer } from '@discordjs/voice';
import ytdl from 'ytdl-core';

export type CurrentQueueRef = {
  current: {
    stream: ReturnType<typeof ytdl>;
    meta: {
      title: string;
      author: string;
      lengthSeconds: string;
    };
  } | null;
  player: AudioPlayer | null;
};
