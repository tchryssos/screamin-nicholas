import { currentQueueRef } from '../state/queue.js';
export const stopPlayer = (interaction) => {
    const { player } = currentQueueRef;
    if (player) {
        player.pause();
        interaction.reply('Stopping player');
        currentQueueRef.current = null;
    }
};
