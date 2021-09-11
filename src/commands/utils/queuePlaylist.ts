import {
  CommandInteraction,
  Guild,
  StageChannel,
  VoiceChannel,
} from 'discord.js';
import ytpl from 'ytpl';

import { createAddedSongCountToQueueMessage } from '../../constants/messages.js';
import { currentQueueRef } from '../../state/queue.js';
// eslint-disable-next-line import/extensions
import { VideoMeta } from '../../typings/queue';

export const queuePlaylist = async (
  url: string,
  interaction: CommandInteraction,
  voiceChannel: VoiceChannel | StageChannel,
  guild: Guild,
  callback?: (items?: VideoMeta[]) => void
) => {
  const { items } = await ytpl(url);
  if (items && items.length) {
    const itemsMeta: VideoMeta[] = items.map((i) => ({
      title: i.title,
      author: i.author.name,
      lengthSeconds: String(i.durationSec),
      url: i.url,
    }));
    currentQueueRef.queue = [...currentQueueRef.queue, ...itemsMeta];
    interaction.reply(createAddedSongCountToQueueMessage(itemsMeta.length));
    callback?.(itemsMeta);
  } else {
    throw new Error('Please provide a valid playlist.');
  }
};
