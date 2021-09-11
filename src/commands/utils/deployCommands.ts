import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

import {
  PLAY,
  QUEUE,
  SKIP,
  STOP,
  VIEW_QUEUE,
} from '../../constants/commands.js';
import {
  PLAY_DESCRIPTION,
  PLAY_URL_DESCRIPTION,
  QUEUE_DESCRIPTION,
  QUEUE_URL_DESCRIPTION,
  REGISTER_COMMANDS_SUCCESS,
  SKIP_DESCRIPTION,
  STOP_DESCRIPTION,
  VIEW_QUEUE_DESCRIPTION,
} from '../../constants/messages.js';

dotenv.config();

const { TOKEN: token, CLIENT_ID: clientId } = process.env;

const commands = [
  new SlashCommandBuilder()
    .setName(PLAY)
    .setDescription(PLAY_DESCRIPTION)
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription(PLAY_URL_DESCRIPTION)
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName(STOP).setDescription(STOP_DESCRIPTION),
  new SlashCommandBuilder()
    .setName(QUEUE)
    .setDescription(QUEUE_DESCRIPTION)
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription(QUEUE_URL_DESCRIPTION)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName(VIEW_QUEUE)
    .setDescription(VIEW_QUEUE_DESCRIPTION),
  new SlashCommandBuilder().setName(SKIP).setDescription(SKIP_DESCRIPTION),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token!);

(async () => {
  const guildIds = [
    process.env.GUILD_ID,
    process.env.ANTHONY_GUILD_ID,
    process.env.TDB_GUILD_ID,
  ];
  try {
    guildIds.forEach(async (id) => {
      await rest.put(Routes.applicationGuildCommands(clientId!, id!), {
        body: commands,
      });
    });
    // eslint-disable-next-line no-console
    console.log(REGISTER_COMMANDS_SUCCESS);
  } catch (error) {
    console.error(error);
  }
})();
