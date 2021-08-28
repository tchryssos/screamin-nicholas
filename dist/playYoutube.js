import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, } from '@discordjs/voice';
import ytdl from 'ytdl-core';
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
            const videoMeta = await ytdl.getBasicInfo(youtubeUrl);
            const stream = ytdl(youtubeUrl, { filter: 'audioonly' });
            const resource = createAudioResource(stream, {
                inputType: StreamType.Arbitrary,
            });
            const player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);
            interaction.reply(`Now playing: ${videoMeta.videoDetails.title}`);
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
