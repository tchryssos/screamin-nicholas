import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { CommandInteraction, Guild } from 'discord.js';
import { currentQueueRef } from 'src/state/queue';
import { YTDLStream } from 'src/typings/queue';

export const playAudio = (
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

  interaction.reply(`Now playing: ${currentQueueRef.current?.meta.title}`);

  if (!initialPlayer) {
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
      currentQueueRef.player = null;
      currentQueueRef.current = null;
    });
  }
};
