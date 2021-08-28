import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

client.on('messageCreate', (msg) => {
  if (msg.content === 'ping') {
    msg.channel.send('pong');
  }
})
