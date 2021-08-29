import { CommandInteraction } from 'discord.js';

import { currentQueueRef } from '../state/queue.js';
import { fetchMeta, fetchStream } from './utils/fetchYoutube.js';
import { playAudio } from './utils/playAudio.js';

export const queuePlayer = async (interaction: CommandInteraction) => {
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
      'Please join a voice channel before queueing audio.'
    );
  }
  const youtubeUrl = options.getString('url');
  if (!youtubeUrl) {
    return interaction.reply('Please provide a URL.');
  }

  try {
    const meta = await fetchMeta(youtubeUrl);
    if (!currentQueueRef.current) {
      const stream = await fetchStream(youtubeUrl);
      currentQueueRef.current = {
        meta,
        stream,
      };
      playAudio(interaction, stream, voiceChannel.id, guild);
    } else {
      currentQueueRef.queue.push(meta);
      interaction.reply(
        `Added "${meta.title}" to the queue. It's #${currentQueueRef.queue.length} in the queue.`
      );
    }
  } catch (e) {
    const { message } = e as Error;
    interaction.reply(message);
  }
};
