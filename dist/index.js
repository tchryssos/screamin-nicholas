import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.TOKEN);
client.on('messageCreate', (msg) => {
    if (msg.content === 'ping') {
        msg.channel.send('pong');
    }
});
