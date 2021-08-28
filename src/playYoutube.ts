import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { Client, CommandInteraction } from 'discord.js';
import ytdl from 'ytdl-core';

export const playYoutube = async (
  client: InstanceType<typeof Client>,
  interaction: CommandInteraction
) => {
  const youtubeUrl = interaction.options.getString('url');
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

    try {
      const videoMeta = await ytdl.getBasicInfo(youtubeUrl);
      const stream = ytdl(youtubeUrl, { filter: 'audioonly' });

      const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
      });
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);

      interaction.reply(`Now playing: ${videoMeta.videoDetails.title}`);

      player.on(AudioPlayerStatus.Idle, () => connection.destroy());
    } catch (e) {
      const { message } = e as Error;
      if (message.includes('No video id found')) {
        interaction.reply('Please submit a valid URL');
      } else if (message.includes('does not match expected format')) {
        interaction.reply(
          'Something is wrong with your URL. Check the video ID and try again.'
        );
      } else {
        interaction.reply('Something went wrong. Please try again.');
      }
    }
  } else {
    interaction.reply('Please provide a URL');
  }
};
