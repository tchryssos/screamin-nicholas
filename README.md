# Screamin' Nicholas

Screamin' Nicholas is a discord bot that takes after [Groovy](https://groovy.bot/), may it rest in peace.

Use [this link](https://discord.com/api/oauth2/authorize?client_id=880628573369684060&permissions=8&scope=bot%20applications.commands) to add Screamin' Nicholas to your servers.

### Development

Screamin' Nicholas uses Node 16 and typescript. You can use `npm start` to spin Nick up locally, or use `npm run build` to create a build (that gets put into the `dist` folder) and upload it to a server.

### Updating Commands

`npm run deployCommands` will update the commands on any specified server. Currently, Screamin' Nicholas does not deploy commands "globally", since this is generally only for personal use. You can create a `.env` file and add some guild `id`s to iterate over in `src/commands/utils/deployCommands.ts`. See [this link](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) to learn more about getting our guild (aka server) `id`.

### TODOs

- Search by title or by Spotify url
- Add /shuffle command to shuffle the queue
- Add /gamble command (maybe once title search works) that will search Youtube and pull something "random"
- Add /clear_queue command to leave current audio playing but remove the queue
- Add volume change commands
