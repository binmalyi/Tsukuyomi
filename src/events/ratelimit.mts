import { RESTEvents, RateLimitData } from 'discord.js';

export const event = RESTEvents.RateLimited;
export async function execute(rateLimitInfo: RateLimitData) {
    console.log(rateLimitInfo);
};