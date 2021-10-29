import { CommandInteraction } from 'discord.js';
import ytpl from 'ytpl';

import {
  createAddedSongCountToQueueMessage,
  INVALID_PLAYLIST_ERROR,
} from '../../constants/messages.js';
import { currentQueueRef } from '../../state/queue.js';
// eslint-disable-next-line import/extensions
import { VideoMeta } from '../../typings/queue';
import { reply } from './reply.js';

export const queuePlaylist = async (
  url: string,
  interaction: CommandInteraction,
  callback?: (items?: VideoMeta[]) => void
) => {
  // interaction.deferReply();
  const { items } = await ytpl(url);
  if (items && items.length) {
    const itemsMeta: VideoMeta[] = items.map((i) => ({
      title: i.title,
      author: i.author.name,
      lengthSeconds: String(i.durationSec),
      url: i.url,
    }));
    currentQueueRef.queue = [...currentQueueRef.queue, ...itemsMeta];
    await reply(
      createAddedSongCountToQueueMessage(itemsMeta.length),
      interaction
    );
    callback?.(itemsMeta);
  } else {
    await reply(INVALID_PLAYLIST_ERROR, interaction);
  }
};
