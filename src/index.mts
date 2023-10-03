import { dirname } from 'path';
import { fileURLToPath } from "url";
import { GatewayIntentBits } from 'discord.js';

console.time('Initialize');

new (await import('./utils/client.mjs')).Tsukuyomi({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ],
    partials: [0,1,2,3,4,5,6],
    // rest: {rejectOnRateLimit: () => true}
})
.init({
    dir: dirname(fileURLToPath(import.meta.url)),
    folders: ['events', 'slashies']
});

console.timeEnd('Initialize');