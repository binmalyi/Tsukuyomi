import { Message } from 'discord.js';

export const eventName = (await import('discord.js')).Events.MessageCreate;
export async function execute(message: Message) {
    console.log(message.channel.messages.cache.size, message.channel.messages.cache);
};