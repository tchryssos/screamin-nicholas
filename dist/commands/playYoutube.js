import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { currentQueueRef } from '../state/queue.js';
export const playYoutube = async (interaction) => {
    const { options, guildId, client } = interaction;
    if (!guildId) {
        return interaction.reply('Please only run this command in a server.');
    }
    const youtubeUrl = options.getString('url');
    if (!youtubeUrl) {
        return interaction.reply('Please provide a URL.');
    }
    const guild = client.guilds.cache.get(guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply('Please join a voice channel before playing audio.');
    }
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
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        player.play(resource);
        connection.subscribe(player);
        interaction.reply(`Now playing: ${title}`);
        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
    }
    catch (e) {
        const { message } = e;
        interaction.reply(message);
    }
};
