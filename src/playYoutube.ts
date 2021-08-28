import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { Client } from 'discord.js';
import ytdl from 'ytdl-core';

export const playYoutube = (
  client: InstanceType<typeof Client>,
  youtubeUrl: string | null
) => {
  if (youtubeUrl) {
    const voiceChannel = client.channels.cache.get(
      process.env.VOICE_CHANNEL_ID!
    );
    const guild = client.guilds.cache.get(process.env.GUILD_ID!);

    const connection = joinVoiceChannel({
      channelId: voiceChannel!.id,
      guildId: guild!.id,
      adapterCreator: guild!.voiceAdapterCreator,
    });

    const stream = ytdl(youtubeUrl, { filter: 'audioonly' });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());
  }
};
