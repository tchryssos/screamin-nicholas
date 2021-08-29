import { CommandInteraction } from 'discord.js';
import { currentQueueRef } from 'src/state/queue';
import { ValidationObj } from 'src/typings/validations';

export const validationsWrapper = (
  interaction: CommandInteraction,
  validationObj: ValidationObj,
  callback: (interaction: CommandInteraction) => void
) => {
  const {
    shouldBeInServer = { validate: true },
    shouldBeInVoice,
    shouldHaveQueue,
    shouldHaveUrl,
  } = validationObj;
  // Run a bunch of checks to make sure that the command can be run successfully...
  const { options, guildId, client } = interaction;
  if (shouldBeInServer?.validate) {
    if (!guildId) {
      return interaction.reply('Please only run this command in a server.');
    }

    const guild = client.guilds.cache.get(guildId)!;
    const member = guild.members.cache.get(interaction.member!.user.id);

    const voiceChannel = member!.voice.channel;
    if (!voiceChannel && shouldBeInVoice?.validate) {
      return interaction.reply(
        shouldBeInVoice.customError ||
          'Please join a voice channel before playing audio.'
      );
    }
  }
  const youtubeUrl = options.getString('url');
  if (!youtubeUrl && shouldHaveUrl?.validate) {
    return interaction.reply(
      shouldHaveUrl.customError || 'Please provide a URL.'
    );
  }

  const queueLength = currentQueueRef.queue.length;

  if (!queueLength && shouldHaveQueue?.validate) {
    interaction.reply(
      shouldHaveQueue.customError || "There's nothing in the queue!"
    );
  }

  return callback(interaction);
};
