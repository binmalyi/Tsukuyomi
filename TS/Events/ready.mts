export const once = true;
export const eventName = (await import('discord.js')).Events.ClientReady;
export async function execute(client: import('../Helper/Class/Client.mjs').Tsukuyomi){
    console.log(`Logged in as ${client.user!.tag}`);
    // client.application!.commands.set([...client.slash.values()].map(app => app.data))
};