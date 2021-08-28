import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';

import { playYoutube } from './commands/playYoutube.js';
import { stopPlayer } from './commands/stopPlayer.js';
import { PLAY, STOP } from './constants/commands.js';

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
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case PLAY:
      playYoutube(client, interaction);
      break;
    case STOP:
      stopPlayer(interaction);
      break;
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
