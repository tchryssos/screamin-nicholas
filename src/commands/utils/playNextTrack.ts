import { CommandInteraction, Guild } from 'discord.js';

import { currentQueueRef } from '../../state/queue.js';
import { YTDLStream } from '../../typings/queue.js';
import { tryFetchStream } from './fetchAudioData.js';
import { playAudio } from './playAudio.js';
import { fetchStream } from './youtube/fetch.js';

export const playNextTrack = async (
  interaction: CommandInteraction,
  voiceChannelId: string,
  guild: Guild
) => {
  const nextMeta = currentQueueRef.queue.shift()!;
  let stream: YTDLStream;
  if (nextMeta.needsSearch) {
    if (!interaction.deferred) {
      await interaction.deferReply();
    }
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
