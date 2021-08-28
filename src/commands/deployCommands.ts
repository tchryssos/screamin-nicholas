import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

import { PLAY, STOP } from '../constants/commands.js';

dotenv.config();

const { TOKEN: token, GUILD_ID: guildId, CLIENT_ID: clientId } = process.env;

const commands = [
  new SlashCommandBuilder()
    .setName(PLAY)
    .setDescription('Play specified audio in your voice channel')
    .addStringOption((option) =>
      option.setName('url').setDescription('the url you want to play')
    ),
  new SlashCommandBuilder()
    .setName(STOP)
    .setDescription('Stop the currently playing audio'),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token!);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId!, guildId!), {
      body: commands,
    });
    // eslint-disable-next-line no-console
    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();
