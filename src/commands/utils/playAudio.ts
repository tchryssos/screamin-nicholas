import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { CommandInteraction, Guild } from 'discord.js';

import { currentQueueRef } from '../../state/queue.js';
// eslint-disable-next-line import/extensions
import { YTDLStream } from '../../typings/queue';
import { playNextTrack } from './playNextTrack.js';

export const playAudio = (
  interaction: CommandInteraction,
  stream: YTDLStream,
  voiceChannelId: string,
  guild: Guild,
  alreadyRepliedToInteraction?: boolean
) => {
  const initialPlayer = currentQueueRef.player;
  let player = initialPlayer;
  if (!player) {
    player = createAudioPlayer();
    currentQueueRef.player = player;
  }

  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });

  // Join voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: guild.id,
    adapterCreator: guild!.voiceAdapterCreator,
  });

  // Play the audio, and related things
  player.play(resource);
  connection.subscribe(player);

  /*
    Since we can't respond to an interaction twice
    as in the case of an IDLE status re-firing playAudio with the next in the queue
    we need to send a normal message to a channel
  */
  const nowPlayingMessage = `Now playing: ${currentQueueRef.current?.meta.title}`;
  if (alreadyRepliedToInteraction) {
    interaction.channel?.send(nowPlayingMessage);
  } else {
    interaction.reply(nowPlayingMessage);
  }

  if (!initialPlayer) {
    player.on(AudioPlayerStatus.Idle, async () => {
      if (currentQueueRef.queue.length) {
        await playNextTrack(interaction, voiceChannelId, guild);
      } else {
        connection.destroy();
        currentQueueRef.player = null;
        currentQueueRef.current = null;
      }
    });
  }
};
