import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';

export type YTDLStream = ReturnType<typeof ytdl>;

export type VideoMeta = {
  title: string;
  author: string;
  lengthSeconds: string;
  url: string;
};

export type CurrentQueueRef = {
  current: {
    stream: YTDLStream;
    meta: VideoMeta;
  } | null;
  player: AudioPlayer | null;
  queue: VideoMeta[];
};
