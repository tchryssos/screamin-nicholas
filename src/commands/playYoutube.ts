import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { CommandInteraction } from 'discord.js';
import ytdl from 'ytdl-core';

import { currentQueueRef } from '../state/queue.js';

// This function is adapted from https://discordjs.guide/popular-topics/faq.html#how-do-i-play-music-from-youtube
export const playYoutube = async (interaction: CommandInteraction) => {
  // Run a bunch of checks to make sure that the command can be run successfully
  const { options, guildId, client } = interaction;
  if (!guildId) {
    return interaction.reply('Please only run this command in a server.');
  }

  const guild = client.guilds.cache.get(guildId)!;
  const member = guild!.members.cache.get(interaction.member!.user.id);

  const voiceChannel = member!.voice.channel;
  if (!voiceChannel) {
    return interaction.reply(
      'Please join a voice channel before playing audio.'
    );
  }

  const youtubeUrl = options.getString('url');
  if (!youtubeUrl) {
    return interaction.reply('Please provide a URL.');
  }

  try {
    // Get the video meta data and stream
    const {
      videoDetails: { title, author, lengthSeconds },
    } = await ytdl.getBasicInfo(youtubeUrl);
    const stream = ytdl(youtubeUrl, { filter: 'audioonly', dlChunkSize: 0 });
    currentQueueRef.current = {
      stream,
      meta: {
        title,
        author: author.name,
        lengthSeconds,
      },
    };

    // Create or use the audio player
    let player = currentQueueRef.player;
    if (!player) {
      player = createAudioPlayer();
      currentQueueRef.player = player;
    }

    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    // Join voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild!.voiceAdapterCreator,
    });

    player.play(resource);
    connection.subscribe(player);

    interaction.reply(`Now playing: ${title}`);

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());
  } catch (e) {
    const { message } = e as Error;
    interaction.reply(message);
  }
};
