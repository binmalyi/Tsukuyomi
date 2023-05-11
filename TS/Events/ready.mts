import { Zelda } from "../Helper/Class/Client.mjs";

export const once = true;
export const eventName = (await import('discord.js')).Events.ClientReady;
export async function execute(client: Zelda){
    console.log(`Logged in as ${client.user!.tag}`);
    // client.application!.commands.set([...client.slash.values()].map(app => app.data))
};