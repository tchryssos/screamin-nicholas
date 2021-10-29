import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { CommandInteraction, Guild } from 'discord.js';

import { createNowPlayingMessage } from '../../constants/messages.js';
import { currentQueueRef } from '../../state/queue.js';
// eslint-disable-next-line import/extensions
import { YTDLStream } from '../../typings/queue';
import { playNextTrack } from './playNextTrack.js';

export const playAudio = async (
  interaction: CommandInteraction,
  stream: YTDLStream,
  voiceChannelId: string,
  guild: Guild
) => {
  const initialPlayer = currentQueueRef.player;
  let player = initialPlayer;
  if (!player) {
    player = createAudioPlayer();
    currentQueueRef.player = player;
  }

  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
    inlineVolume: true,
  });

  currentQueueRef.current.resource = resource;

  // Join voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: guild.id,
    adapterCreator: guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator,
  });

  // Play the audio, and related things
  player.play(resource);
  connection.subscribe(player);

  /*
    Since we can't respond to an interaction twice
    as in the case of an IDLE status re-firing playAudio with the next in the queue
    we need to send a normal message to a channel
  */
  const nowPlayingMessage = createNowPlayingMessage(
    currentQueueRef.current.meta?.title || ''
  );
  if (interaction.replied) {
    interaction.channel?.send(nowPlayingMessage);
  } else {
    await interaction.reply(nowPlayingMessage);
  }

  if (!initialPlayer) {
    player.on(AudioPlayerStatus.Idle, async () => {
      if (currentQueueRef.queue.length) {
        await playNextTrack(interaction, voiceChannelId, guild);
      } else {
        connection.destroy();
        currentQueueRef.player = null;
        currentQueueRef.current = {};
      }
    });
  }
};
