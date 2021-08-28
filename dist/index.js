import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import { playYoutube } from './playYoutube.js';
dotenv.config();
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    const { commandName } = interaction;
    switch (commandName) {
        case 'ping':
            interaction.reply('pong');
            break;
        case 'play':
            playYoutube(client, interaction.options.getString('url'));
            break;
    }
});
client.login(process.env.TOKEN);
