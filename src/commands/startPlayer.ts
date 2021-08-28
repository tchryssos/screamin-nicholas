import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';
import { fetchMeta, fetchStream } from './utils/fetchYoutube.js';
import { playAudio } from './utils/playAudio.js';

// This function (and its utils) adapted from https://discordjs.guide/popular-topics/faq.html#how-do-i-play-music-from-youtube
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

  try {
    const stream = await fetchStream(youtubeUrl);
    const meta = await fetchMeta(youtubeUrl);
    currentQueueRef.current = {
      stream,
      meta,
    };

    playAudio(interaction, stream, voiceChannel.id, guild);
  } catch (e) {
    const { message } = e as Error;
    interaction.reply(message);
  }
};
