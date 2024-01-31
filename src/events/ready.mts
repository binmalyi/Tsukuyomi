import { Events } from 'discord.js';
import { Tsukuyomi } from '../utils/client.mjs';

export const once = true;
export const event = Events.ClientReady;
export async function execute(client: Tsukuyomi){
    console.log(`${client.user!.tag} successfully logged in`, (await client.application!.commands.fetch()));
};