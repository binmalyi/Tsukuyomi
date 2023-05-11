import { RateLimitData } from 'discord.js';

export const rest = true;
export const eventName = (await import('discord.js')).RESTEvents.RateLimited;
export async function execute(rateLimitInfo: RateLimitData) {
    console.log(rateLimitInfo);
};