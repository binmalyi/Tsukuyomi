import { Message } from 'discord.js';

export const eventName = (await import('discord.js')).Events.MessageDelete;
export async function execute(message: Message) {
    if (!message.channel.messages.cache.has(message.id)) await message.channel.messages.fetch();
    console.log(message.channel.messages.cache.get(message.id)?.author);
};