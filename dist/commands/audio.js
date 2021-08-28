import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { currentQueueRef } from '../state/queue.js';
export const playYoutube = async (client, interaction) => {
    const youtubeUrl = interaction.options.getString('url');
    if (youtubeUrl) {
        const voiceChannel = client.channels.cache.get(process.env.VOICE_CHANNEL_ID);
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        try {
            const { videoDetails: { title, author, lengthSeconds }, } = await ytdl.getBasicInfo(youtubeUrl);
            const stream = ytdl(youtubeUrl, { filter: 'audioonly', dlChunkSize: 0 });
            currentQueueRef.current = {
                stream,
                meta: {
                    title,
                    author: author.name,
                    lengthSeconds,
                },
            };
            const resource = createAudioResource(stream, {
                inputType: StreamType.Arbitrary,
            });
            const player = createAudioPlayer();
            currentQueueRef.player = player;
            player.play(resource);
            connection.subscribe(player);
            interaction.reply(`Now playing: ${title}`);
            player.on(AudioPlayerStatus.Idle, () => connection.destroy());
        }
        catch (e) {
            const { message } = e;
            interaction.reply(message);
        }
    }
    else {
        interaction.reply('Please provide a URL');
    }
};
export const stopYoutube = (interaction) => {
    const { player } = currentQueueRef;
    if (player) {
        player.pause();
        interaction.reply('Stopping');
        currentQueueRef.current = null;
    }
};
