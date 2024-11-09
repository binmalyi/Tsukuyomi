import { Message, type ClientEvents } from "discord.js";
import { setTimeout } from "timers/promises";
import { chunkify, SNOWFLAKE } from "../util/index";

export default async function(...params: ClientEvents["messageCreate"] | ClientEvents["interactionCreate"]){
    const event = params[0];
    if (!(event instanceof Message ? event.inGuild() : event.inCachedGuild())) return;

    if (event instanceof Message){
        const chunks = chunkify(event.content).slice(1);

        const
            channel = event.channel,
            messages = (await channel.messages.fetch({limit: 100, before: event.id})).filter(m => m.author.id === (event.mentions.users.first()?.id ?? chunks.find(c => SNOWFLAKE.test(c)) ?? event.author.id)).first(Number.parseInt(chunks.find(c => (/\d{1,3}/).test(c) && !(/(\-\d+|0)/).test(c)) ?? "100"));

        if (!channel.isDMBased()) channel.bulkDelete(messages)
            .then(async c => await event.channel.send(`\`✅ Successfully deleted ${c.size} messages\``))
            .then(async m => await setTimeout(5000, m))
            .then(async t => await t.delete())
            .finally(async () => await event.delete());
    };
};