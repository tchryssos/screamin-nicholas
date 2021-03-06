import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

import {
  BAN,
  CLEAR_QUEUE,
  MEMBER_OPTION,
  PLAY,
  QUERY_OPTION,
  QUEUE,
  SHUFFLE_QUEUE,
  SKIP,
  STOP,
  UNBAN,
  VIEW_BANLIST,
  VIEW_QUEUE,
  VOLUME,
  VOLUME_OPTION,
} from '../../constants/commands.js';
import {
  BAN_DESCRIPTION,
  BAN_MEMBER_DESCRIPTION,
  CLEAR_QUEUE_DESCRIPTION,
  PLAY_DESCRIPTION,
  PLAY_URL_DESCRIPTION,
  QUEUE_DESCRIPTION,
  QUEUE_URL_DESCRIPTION,
  REGISTER_COMMANDS_SUCCESS,
  SHUFFLE_QUEUE_DESCRIPTION,
  SKIP_DESCRIPTION,
  STOP_DESCRIPTION,
  UNBAN_MEMBER_DESCRIPTION,
  VIEW_BANLIST_DESCRIPTION,
  VIEW_QUEUE_DESCRIPTION,
  VOLUME_DESCRIPTION,
  VOLUME_OPTION_DESCRIPTION,
} from '../../constants/messages.js';

dotenv.config();

const { TOKEN: token, CLIENT_ID: clientId } = process.env;

const commands = [
  new SlashCommandBuilder()
    .setName(PLAY)
    .setDescription(PLAY_DESCRIPTION)
    .addStringOption((option) =>
      option
        .setName(QUERY_OPTION)
        .setDescription(PLAY_URL_DESCRIPTION)
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName(STOP).setDescription(STOP_DESCRIPTION),
  new SlashCommandBuilder()
    .setName(QUEUE)
    .setDescription(QUEUE_DESCRIPTION)
    .addStringOption((option) =>
      option
        .setName(QUERY_OPTION)
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
  new SlashCommandBuilder()
    .setName(CLEAR_QUEUE)
    .setDescription(CLEAR_QUEUE_DESCRIPTION),
  new SlashCommandBuilder()
    .setName(SHUFFLE_QUEUE)
    .setDescription(SHUFFLE_QUEUE_DESCRIPTION),
  new SlashCommandBuilder()
    .setName(VOLUME)
    .setDescription(VOLUME_DESCRIPTION)
    .addIntegerOption((option) =>
      option.setName(VOLUME_OPTION).setDescription(VOLUME_OPTION_DESCRIPTION)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token!);

(async () => {
  const guildIds = [
    process.env.GUILD_ID,
    process.env.ANTHONY_GUILD_ID,
    process.env.TDB_GUILD_ID,
    process.env.QPG_GUILD_ID,
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
