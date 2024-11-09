import type { ClientEvents } from "discord.js";
import type { Tsukuyomi } from "../client";

export default function(...params: ClientEvents["interactionCreate"]){
    const interaction = params[0], client = interaction.client as Tsukuyomi;

    if (interaction.isChatInputCommand()) client.store.get(interaction.commandName)!(interaction);
};