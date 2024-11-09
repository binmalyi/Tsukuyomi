import type { ClientEvents } from "discord.js";
import type { Tsukuyomi } from "../client";
import { chunkify } from "../util/chunks";

export default function(...params: ClientEvents["messageCreate"]){
    if (params[0].author.bot || !params[0].content.startsWith(process.env["PREFIX"]!)) return;
    const [command] = chunkify(params[0].content), client = params[0].client as Tsukuyomi;

    if (client.store.has(command!)) client.store.get(command!)!(params[0]);
};