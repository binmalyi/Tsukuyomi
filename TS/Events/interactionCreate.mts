import { ChatInputCommandInteraction, Events } from "discord.js";
import { Zelda } from "../Helper/Class/Client.mjs";

export const eventName = Events.InteractionCreate;
export function execute(interaction: ChatInputCommandInteraction){
    const client = interaction.client as Zelda;

    if (interaction.isChatInputCommand()) client.slash.get(interaction.commandName)!.execute(interaction).catch(console.error);
};