import { CommandInteraction } from 'discord.js';

export const validateIsInServer = (interaction: CommandInteraction) => {
  const { guildId, client } = interaction;
  if (!guildId) {
    interaction.reply('Please only run this command in a server.');
  }
  return guildId ? client.guilds.cache.get(guildId) : false;
};

export const validateIsInVoice = (interaction: CommandInteraction) => {
  const { guildId, client } = interaction;
  const guild = client.guilds.cache.get(guildId!)!;
  const member = guild.members.cache.get(interaction.member!.user.id);

  const voiceChannel = member!.voice.channel;
  if (!voiceChannel) {
    interaction.reply('Please join a voice channel before playing audio.');
  }
  return voiceChannel;
};
