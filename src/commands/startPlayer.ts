import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';
import { fetchMeta, fetchStream } from './fetchYoutube.js';

// This function is adapted from https://discordjs.guide/popular-topics/faq.html#how-do-i-play-music-from-youtube
export const startPlayer = async (interaction: CommandInteraction) => {
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { options, guildId, client } = interaction;
  if (!guildId) {
    return interaction.reply('Please only run this command in a server.');
  }

  const guild = client.guilds.cache.get(guildId)!;
  const member = guild.members.cache.get(interaction.member!.user.id);

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

  // ...and if it can...
  try {
    // Get the video meta data and stream
    const stream = await fetchStream(youtubeUrl);
    const meta = await fetchMeta(youtubeUrl);
    currentQueueRef.current = {
      stream,
      meta,
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

    // Play the audio, and related things
    player.play(resource);
    connection.subscribe(player);

    interaction.reply(`Now playing: ${currentQueueRef.current?.meta.title}`);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
      currentQueueRef.player = null;
      currentQueueRef.current = null;
    });
  } catch (e) {
    const { message } = e as Error;
    interaction.reply(message);
  }
};
