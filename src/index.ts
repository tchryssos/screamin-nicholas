import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

import { banMemberResponder } from './commands/banMember.js';
import { clearQueueResponder } from './commands/clearQueue.js';
import { queuePlayerResponder } from './commands/queuePlayer.js';
import { shuffleQueueResponder } from './commands/shuffleQueue.js';
import { skipTrackResponder } from './commands/skipTrack.js';
import { startPlayerResponder } from './commands/startPlayer.js';
import { stopPlayerResponder } from './commands/stopPlayer.js';
import { unbanMemberResponder } from './commands/unbanMember.js';
import { viewBanlistResponder } from './commands/viewBanlist.js';
import { viewQueueResponder } from './commands/viewQueue.js';
import { volumeResponder } from './commands/volume.js';
import {
  BAN,
  CLEAR_QUEUE,
  PLAY,
  QUEUE,
  SHUFFLE_QUEUE,
  SKIP,
  STOP,
  UNBAN,
  VIEW_BANLIST,
  VIEW_QUEUE,
  VOLUME,
} from './constants/commands.js';
import { GENERAL_ERROR_MESSAGE } from './constants/messages.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
  // eslint-disable-next-line no-console
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  try {
    switch (commandName) {
      case PLAY:
        startPlayerResponder(interaction);
        break;
      case STOP:
        stopPlayerResponder(interaction);
        break;
      case QUEUE:
        queuePlayerResponder(interaction);
        break;
      case VIEW_QUEUE:
        viewQueueResponder(interaction);
        break;
      case SKIP:
        skipTrackResponder(interaction);
        break;
      case BAN:
        banMemberResponder(interaction);
        break;
      case UNBAN:
        unbanMemberResponder(interaction);
        break;
      case VIEW_BANLIST:
        viewBanlistResponder(interaction);
        break;
      case CLEAR_QUEUE:
        clearQueueResponder(interaction);
        break;
      case SHUFFLE_QUEUE:
        shuffleQueueResponder(interaction);
        break;
      case VOLUME:
        volumeResponder(interaction);
        break;
    }
  } catch (e) {
    const message = (e as Error).message || GENERAL_ERROR_MESSAGE;
    interaction.channel?.send(
      `Something went wrong running \`/${commandName}\`: ${message}`
    );
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
