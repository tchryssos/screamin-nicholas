import { CommandInteraction, Guild } from 'discord.js';

import { currentQueueRef } from '../../state/queue.js';
import { fetchStream } from './fetchAudioData.js';
import { playAudio } from './playAudio.js';

export const playNextTrack = async (
  interaction: CommandInteraction,
  voiceChannelId: string,
  guild: Guild
) => {
  // if (!interaction.replied) {
  //   interaction.deferReply();
  // }
  const nextMeta = currentQueueRef.queue.shift()!;
  const stream = await fetchStream(nextMeta.url);
  currentQueueRef.current = {
    meta: nextMeta,
    stream,
  };
  playAudio(interaction, stream, voiceChannelId, guild);
};
