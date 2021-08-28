import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import { playYoutube, stopYoutube } from './commands/audio.js';
import { PLAY, STOP } from './constants/commands.js';
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
        case PLAY:
            playYoutube(client, interaction);
            break;
        case STOP:
            stopYoutube(interaction);
            break;
    }
});
client.login(process.env.TOKEN);
