import { CommandInteraction, Guild } from 'discord.js';

import {
  createAddedSongToQueueMessage,
  DISCORD_INFO_FETCH_ERROR,
} from '../constants/messages.js';
import { YOUTUBE_PLAYLIST_REGEX } from '../constants/regex.js';
import { currentQueueRef } from '../state/queue.js';
import { VideoMeta } from '../typings/queue.js';
// eslint-disable-next-line import/extensions
import { InteractionData } from '../typings/validations';
import { fetchMeta, fetchStream } from './utils/fetchYoutube.js';
import { playAudio } from './utils/playAudio.js';
import { queuePlaylist } from './utils/queuePlaylist.js';
import { validationsWrapper } from './utils/validationsWrapper.js';

const fetchAndPlay = async (
  meta: VideoMeta,
  interaction: CommandInteraction,
  channelId: string,
  guild: Guild,
  hasAlreadyReplied: boolean
) => {
  const stream = await fetchStream(meta.url);
  currentQueueRef.current = {
    meta,
    stream,
  };
  playAudio(interaction, stream, channelId, guild, hasAlreadyReplied);
};

export const queuePlayer = async (
  interaction: CommandInteraction,
  interactionData: InteractionData
) => {
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { url, voiceChannel, guild } = interactionData;
  try {
    if (!url || !voiceChannel || !guild) {
      throw new Error(DISCORD_INFO_FETCH_ERROR);
    }
    const isPlaylist = YOUTUBE_PLAYLIST_REGEX.test(url);
    if (isPlaylist) {
      await queuePlaylist(
        url,
        interaction,
        voiceChannel,
        guild,
        async (metaArray) => {
          if (!currentQueueRef.current) {
            await fetchAndPlay(
              metaArray![0],
              interaction,
              voiceChannel.id,
              guild,
              true
            );
          }
        }
      );
    } else {
      const meta = await fetchMeta(url);
      if (!currentQueueRef.current) {
        await fetchAndPlay(meta, interaction, voiceChannel.id, guild, false);
      } else {
        currentQueueRef.queue.push(meta);
        interaction.reply(
          createAddedSongToQueueMessage(
            meta.title,
            currentQueueRef.queue.length
          )
        );
      }
    }
  } catch (e) {
    const { message } = e as Error;
    interaction.reply(message);
  }
};

export const queuePlayerResponder = (interaction: CommandInteraction) =>
  validationsWrapper(
    interaction,
    { shouldBeInVoice: { validate: true }, shouldHaveUrl: { validate: true } },
    queuePlayer
  );
