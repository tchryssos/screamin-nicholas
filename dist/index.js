import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    const { commandName } = interaction;
    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    else if (commandName === 'server') {
        await interaction.reply('Server info.');
    }
    else if (commandName === 'user') {
        await interaction.reply('User info.');
    }
});
client.login(process.env.TOKEN);
