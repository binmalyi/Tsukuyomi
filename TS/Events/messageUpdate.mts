import { Message } from 'discord.js';

export const eventName = (await import('discord.js')).Events.MessageUpdate;
export async function execute(oldMessage: Message, newMessage: Message) {
    console.log(oldMessage, newMessage);
};