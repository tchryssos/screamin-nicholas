import { CommandInteraction, Guild } from 'discord.js';

import { currentQueueRef } from '../../state/queue.js';
import { YTDLStream } from '../../typings/queue.js';
import { fetchStream, tryFetchStream } from './fetchAudioData.js';
import { playAudio } from './playAudio.js';

export const playNextTrack = async (
  interaction: CommandInteraction,
  voiceChannelId: string,
  guild: Guild
) => {
  const nextMeta = currentQueueRef.queue.shift()!;
  let stream: YTDLStream;
  if (nextMeta.needsSearch) {
    const { stream: fetchedStream } = await tryFetchStream(
      `${nextMeta.title} by ${nextMeta.author}`,
      interaction
    );
    stream = fetchedStream;
  } else {
    stream = await fetchStream(nextMeta.url);
  }
  currentQueueRef.current = {
    meta: { ...nextMeta, needsSearch: false },
    stream,
  };
  playAudio(interaction, stream, voiceChannelId, guild);
};
