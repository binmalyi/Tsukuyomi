import { Message } from 'discord.js';

export const eventName = (await import('discord.js')).Events.MessageDelete;
export async function execute(message: Message) {
    console.log('A message was deleted!');
};