import { ChatInputCommandInteraction, Events } from "discord.js";
import { Tsukuyomi } from "../Helper/Class/Client.mjs";

export const eventName = Events.InteractionCreate;
export function execute(interaction: ChatInputCommandInteraction){
    const client = interaction.client as Tsukuyomi;
    if (interaction.isChatInputCommand()) client.slash.get(interaction.commandName)!.execute(interaction).catch(console.error);
};