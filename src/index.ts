import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';

import { queuePlayerResponder } from './commands/queuePlayer.js';
import { skipTrack, skipTrackResponder } from './commands/skipTrack.js';
import { startPlayerResponder } from './commands/startPlayer.js';
import { stopPlayer } from './commands/stopPlayer.js';
import { viewQueueResponder } from './commands/viewQueue.js';
import { PLAY, QUEUE, SKIP, STOP, VIEW_QUEUE } from './constants/commands.js';

dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
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

  switch (commandName) {
    case PLAY:
      startPlayerResponder(interaction);
      break;
    case STOP:
      stopPlayer(interaction);
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
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
