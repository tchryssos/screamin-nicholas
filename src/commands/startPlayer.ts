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
import { validateIsInServer, validateIsInVoice } from './validations.js';

// This function is adapted from https://discordjs.guide/popular-topics/faq.html#how-do-i-play-music-from-youtube
export const startPlayer = async (interaction: CommandInteraction) => {
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { options } = interaction;

  const guild = validateIsInServer(interaction);
  const voiceChannel = validateIsInVoice(interaction);

  const youtubeUrl = options.getString('url');
  if (!youtubeUrl) {
    return interaction.reply('Please provide a URL.');
  }

  if (guild && voiceChannel) {
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
  }
};
