import { dirname } from 'path';
import { fileURLToPath } from "url";

console.time('Initialize');

new (await import('./Helper/Class/Client.mjs')).Tsukuyomi({
    intents: 37647,
    partials: [0,1,2,3,4,5,6],
    rest: {rejectOnRateLimit: () => true}
})
.init({
    base: dirname(fileURLToPath(import.meta.url)),
    folders: ['Events', 'Slashies']
});

console.timeEnd('Initialize');