import { CommandInteraction } from 'discord.js';

export const skipTrack = (interaction: CommandInteraction) => {
  const { client, guildId } = interaction;

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
};
