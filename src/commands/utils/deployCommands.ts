import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

import {
  BAN,
  MEMBER_OPTION,
  PLAY,
  QUEUE,
  SKIP,
  STOP,
  UNBAN,
  URL_OPTION,
  VIEW_BANLIST,
  VIEW_QUEUE,
} from '../../constants/commands.js';
import {
  BAN_DESCRIPTION,
  BAN_MEMBER_DESCRIPTION,
  PLAY_DESCRIPTION,
  PLAY_URL_DESCRIPTION,
  QUEUE_DESCRIPTION,
  QUEUE_URL_DESCRIPTION,
  REGISTER_COMMANDS_SUCCESS,
  SKIP_DESCRIPTION,
  STOP_DESCRIPTION,
  UNBAN_MEMBER_DESCRIPTION,
  VIEW_BANLIST_DESCRIPTION,
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
        .setName(URL_OPTION)
        .setDescription(PLAY_URL_DESCRIPTION)
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName(STOP).setDescription(STOP_DESCRIPTION),
  new SlashCommandBuilder()
    .setName(QUEUE)
    .setDescription(QUEUE_DESCRIPTION)
    .addStringOption((option) =>
      option
        .setName(URL_OPTION)
        .setDescription(QUEUE_URL_DESCRIPTION)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName(VIEW_QUEUE)
    .setDescription(VIEW_QUEUE_DESCRIPTION),
  new SlashCommandBuilder().setName(SKIP).setDescription(SKIP_DESCRIPTION),
  new SlashCommandBuilder()
    .setName(BAN)
    .setDescription(BAN_DESCRIPTION)
    .addMentionableOption((option) =>
      option
        .setName(MEMBER_OPTION)
        .setDescription(BAN_MEMBER_DESCRIPTION)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName(UNBAN)
    .setDescription(UNBAN_MEMBER_DESCRIPTION)
    .addMentionableOption((option) =>
      option
        .setName(MEMBER_OPTION)
        .setDescription(UNBAN_MEMBER_DESCRIPTION)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName(VIEW_BANLIST)
    .setDescription(VIEW_BANLIST_DESCRIPTION),
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
